import { sql, type SelectQueryBuilder } from "kysely";
import { randomUUID } from "node:crypto";
import { db } from "~/lib/db/index.server";
import { buildLikeFragment } from "./like";
import {
  readProjectMetadata,
  slugify,
  type AdminMutationResult,
  type CreateProjectInput,
  type ProjectManagerOption,
  type ProjectMetadata,
  type ProjectWithManagers,
  type UpdateProjectInput,
} from "./types";

/** Distinct, sorted list of clients across all projects (for the client combobox). */
export async function getUniqueClients(): Promise<string[]> {
  const projects = await db.selectFrom("project").select("metadata").execute();

  const clients = new Set<string>();
  for (const project of projects) {
    const metadata = readProjectMetadata(project.metadata);
    if (metadata.client) clients.add(metadata.client);
  }
  return Array.from(clients).sort();
}

/**
 * Users eligible to be assigned as project managers. Excludes banned users.
 * (Admin access is email-based; a non-banned user with any role is eligible.)
 */
export async function getProjectManagers(): Promise<ProjectManagerOption[]> {
  return db
    .selectFrom("user")
    .select(["id", "name", "email", "image"])
    .where("banned", "=", false)
    .orderBy("name")
    .execute();
}

/**
 * Apply the shared name/description/slug/metadata/manager search filter to a
 * project query builder. Generic over the builder type so it works for both
 * the list query (selectAll) and the count query (no columns) without widening
 * return types or dragging non-grouped columns into a count().
 */
function applyProjectSearch<DB2, TB extends keyof DB2 & string, O>(
  query: SelectQueryBuilder<DB2, TB, O>,
  searchQuery?: string,
): SelectQueryBuilder<DB2, TB, O> {
  const trimmed = searchQuery?.trim();
  if (!trimmed) return query;

  const fragment = buildLikeFragment(trimmed);
  return query.where((eb) =>
    eb.or([
      sql<boolean>`${sql.ref("project.name")} ilike ${fragment} escape '\\'`,
      sql<boolean>`${sql.ref("project.description")} ilike ${fragment} escape '\\'`,
      sql<boolean>`${sql.ref("project.slug")} ilike ${fragment} escape '\\'`,
      sql<boolean>`exists (select 1 from jsonb_each_text(project.metadata::jsonb) as kv where kv.value ilike ${fragment} escape '\\')`,
      sql<boolean>`exists (select 1 from project_manager pm join "user" u on u.id = pm."userId" where pm."projectId" = project.id and pm."terminatedAt" is null and u.name ilike ${fragment} escape '\\')`,
    ]),
  );
}

/** Base query for the project *list*: selects all project columns. */
function createProjectQuery() {
  return db.selectFrom("project").selectAll("project");
}

/** Base query for project *counts*: selects no project columns, so countAll()
 *  does not drag non-grouped columns into the SELECT list. */
function createProjectCountQuery() {
  return db.selectFrom("project");
}

/** Page of projects (across all owners) with their active managers attached. */
export async function getProjectsWithManagers(
  page: number,
  pageSize: number,
  searchQuery?: string,
): Promise<ProjectWithManagers[]> {
  const query = applyProjectSearch(createProjectQuery(), searchQuery);

  const projects = await query
    .orderBy("project.createdAt", "desc")
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .execute();

  if (projects.length === 0) return [];

  const projectIds = projects.map((p) => p.id);
  const managerRows = await db
    .selectFrom("project_manager")
    .innerJoin("user", "user.id", "project_manager.userId")
    .select([
      "project_manager.projectId as projectId",
      "user.id",
      "user.name",
      "user.image",
    ])
    .where("project_manager.projectId", "in", projectIds)
    .where("project_manager.terminatedAt", "is", null)
    .execute();

  const managersByProject = new Map<
    string,
    Array<{ id: string; name: string; image: string | null }>
  >();
  for (const row of managerRows) {
    const list = managersByProject.get(row.projectId) ?? [];
    list.push({ id: row.id, name: row.name, image: row.image });
    managersByProject.set(row.projectId, list);
  }

  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    description: project.description,
    slug: project.slug,
    archived: project.archived,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    metadata: readProjectMetadata(project.metadata),
    ownerId: project.ownerId,
    managers: managersByProject.get(project.id) ?? [],
  }));
}

/** Count of projects matching the search (across all owners). */
export async function getProjectCount(searchQuery?: string): Promise<number> {
  const query = applyProjectSearch(createProjectCountQuery(), searchQuery);
  const result = await query
    .select((qb) => qb.fn.countAll().as("count"))
    .executeTakeFirst();
  return Number(result?.count ?? 0);
}

function normalizeProjectInput(input: {
  name: string;
  slug: string;
  client: string;
  description?: string;
  phase?: ProjectMetadata["phase"];
  indication?: string;
}): {
  name: string;
  slug: string;
  metadata: ProjectMetadata;
  description: string | null;
} {
  const trimmedName = input.name.trim();
  const finalSlug = input.slug.trim()
    ? slugify(input.slug.trim())
    : slugify(trimmedName);
  const metadata: ProjectMetadata = {
    client: input.client.trim() || null,
    phase: input.phase ?? null,
    indication: input.indication?.trim() || null,
  };
  return {
    name: trimmedName,
    slug: finalSlug,
    metadata,
    description: input.description?.trim() || null,
  };
}

export async function createProject(
  input: CreateProjectInput,
  actingUserId: string,
): Promise<AdminMutationResult & { projectId?: string }> {
  if (!input.name.trim()) {
    return { success: false, error: "Project name is required" };
  }
  if (!input.client.trim()) {
    return { success: false, error: "Client is required" };
  }
  if (input.managerIds.length === 0) {
    return {
      success: false,
      error: "At least one project manager is required",
    };
  }

  const normalized = normalizeProjectInput(input);
  const now = new Date();
  const id = randomUUID();

  try {
    await db.transaction().execute(async (trx) => {
      await trx
        .insertInto("project")
        .values({
          id,
          ownerId: actingUserId,
          name: normalized.name,
          slug: normalized.slug,
          description: normalized.description,
          status: "active",
          archived: false,
          metadata: JSON.stringify(normalized.metadata),
          createdAt: now,
          updatedAt: now,
        })
        .execute();

      const rows = input.managerIds.map((userId) => ({
        projectId: id,
        userId,
        createdAt: now,
      }));
      await trx.insertInto("project_manager").values(rows).execute();
    });

    return { success: true, projectId: id };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(
  input: UpdateProjectInput,
): Promise<AdminMutationResult> {
  if (input.managerIds.length === 0) {
    return {
      success: false,
      error: "At least one project manager is required",
    };
  }

  const normalized = normalizeProjectInput(input);
  const now = new Date();

  try {
    await db.transaction().execute(async (trx) => {
      await trx
        .updateTable("project")
        .set({
          name: normalized.name,
          slug: normalized.slug,
          description: normalized.description,
          metadata: JSON.stringify(normalized.metadata),
          updatedAt: now,
        })
        .where("id", "=", input.projectId)
        .execute();

      const current = await trx
        .selectFrom("project_manager")
        .select("userId")
        .where("projectId", "=", input.projectId)
        .where("terminatedAt", "is", null)
        .execute();
      const currentIds = current.map((row) => row.userId);

      const toAdd = input.managerIds.filter((id) => !currentIds.includes(id));
      const toRemove = currentIds.filter(
        (id) => !input.managerIds.includes(id),
      );

      if (toAdd.length > 0) {
        await trx
          .insertInto("project_manager")
          .values(
            toAdd.map((userId) => ({
              projectId: input.projectId,
              userId,
              createdAt: now,
            })),
          )
          .execute();
      }

      if (toRemove.length > 0) {
        await trx
          .updateTable("project_manager")
          .set({ terminatedAt: now })
          .where("projectId", "=", input.projectId)
          .where("userId", "in", toRemove)
          .execute();
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function setProjectArchiveStatus(
  projectId: string,
  archived: boolean,
): Promise<AdminMutationResult> {
  try {
    await db
      .updateTable("project")
      .set({ archived, updatedAt: new Date() })
      .where("id", "=", projectId)
      .execute();
    return { success: true };
  } catch (error) {
    console.error("Failed to update project archive status:", error);
    return { success: false, error: "Failed to update project" };
  }
}
