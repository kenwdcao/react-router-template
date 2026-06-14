import { randomUUID } from "node:crypto";
import { slugify } from "~/lib/admin/types";
import { db } from "~/lib/db/index.server";
import { PROJECT_STATUS, type ProjectStatus } from "~/lib/demo/projects";

export type ProjectSummary = Awaited<
  ReturnType<typeof listProjectsForUser>
>[number];

const projectSelection = [
  "id",
  "name",
  "description",
  "status",
  "createdAt",
  "updatedAt",
] as const;

export async function listProjectsForUser(ownerId: string) {
  return db
    .selectFrom("project")
    .select(projectSelection)
    .where("ownerId", "=", ownerId)
    .orderBy("createdAt", "desc")
    .execute();
}

export async function listRecentProjectsForUser(ownerId: string, limit = 5) {
  return db
    .selectFrom("project")
    .select(projectSelection)
    .where("ownerId", "=", ownerId)
    .orderBy("updatedAt", "desc")
    .limit(limit)
    .execute();
}

export async function countProjectsForUser(ownerId: string) {
  const result = await db
    .selectFrom("project")
    .where("ownerId", "=", ownerId)
    .select((qb) => qb.fn.countAll().as("count"))
    .executeTakeFirst();

  return Number(result?.count ?? 0);
}

export async function createProject({
  ownerId,
  name,
  description,
}: {
  ownerId: string;
  name: string;
  description: string | null;
}) {
  const now = new Date();
  const id = randomUUID();

  // name must contain at least one alphanumeric character; otherwise slugify
  // returns "" and the slug would be malformed (e.g. "-abc12345").
  if (!/[a-zA-Z0-9]/.test(name)) {
    throw new Error(
      "Project name must contain at least one alphanumeric character",
    );
  }

  // Slug must be unique; suffix with a short slice of the id to avoid collisions
  // when two owners create projects with the same name.
  const slug = `${slugify(name)}-${id.slice(0, 8)}`;

  return db
    .insertInto("project")
    .values({
      id,
      ownerId,
      name,
      description,
      slug,
      status: PROJECT_STATUS.active,
      createdAt: now,
      updatedAt: now,
    })
    .returning(projectSelection)
    .executeTakeFirstOrThrow();
}

export async function updateProject({
  ownerId,
  projectId,
  name,
  description,
  status,
}: {
  ownerId: string;
  projectId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
}) {
  return db
    .updateTable("project")
    .set({
      name,
      description,
      status,
      updatedAt: new Date(),
    })
    .where("id", "=", projectId)
    .where("ownerId", "=", ownerId)
    .returning(projectSelection)
    .executeTakeFirst();
}

export async function deleteProject({
  ownerId,
  projectId,
}: {
  ownerId: string;
  projectId: string;
}) {
  return db
    .deleteFrom("project")
    .where("id", "=", projectId)
    .where("ownerId", "=", ownerId)
    .returning("id")
    .executeTakeFirst();
}
