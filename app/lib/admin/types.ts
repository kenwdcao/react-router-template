import type { Json } from "~/lib/db/database-types";

/** Project phase options, mirrored from the reference project. */
export const PROJECT_PHASES = [
  "Phase 1",
  "Phase Ib",
  "Phase 2",
  "Phase 2b",
  "Phase 3",
  "Phase 4",
] as const;

export type ProjectPhase = (typeof PROJECT_PHASES)[number];

/**
 * Free-form metadata stored on each project's `metadata` jsonb column. All
 * fields optional; the admin UI renders "Not Set" for missing values.
 */
export interface ProjectMetadata {
  client?: string | null;
  phase?: ProjectPhase | null;
  indication?: string | null;
  custom?: Record<string, unknown> | null;
}

/** Coerced metadata read off a project row. Unknown shapes degrade to `{}`. */
export function readProjectMetadata(raw: Json | null): ProjectMetadata {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    // Narrowed to JsonObject, whose optional index signature is assignable to
    // ProjectMetadata (all fields optional). Runtime values may carry unknown
    // keys; read them defensively at use sites.
    return raw;
  }
  return {};
}

/** A project manager candidate (selectable in create/edit forms). */
export interface ProjectManagerOption {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

/** A project with its active managers attached. */
export interface ProjectWithManagers {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  archived: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: ProjectMetadata;
  ownerId: string;
  managers: Array<{ id: string; name: string; image: string | null }>;
}

export interface CreateProjectInput {
  name: string;
  slug: string;
  client: string;
  phase?: ProjectPhase | null;
  indication?: string;
  description?: string;
  managerIds: string[];
}

export interface UpdateProjectInput {
  projectId: string;
  name: string;
  slug: string;
  client: string;
  phase?: ProjectPhase | null;
  indication?: string;
  description?: string;
  managerIds: string[];
}

export type AdminMutationResult =
  | { success: true }
  | { success: false; error: string };

/** Convert a project name into a URL-friendly slug. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
