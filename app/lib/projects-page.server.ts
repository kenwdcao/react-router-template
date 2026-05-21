import { data, redirect } from "react-router";
import { z } from "zod";
import { requireAuth } from "~/lib/auth/require-auth.server";
import { PROJECT_STATUS } from "~/lib/projects";
import {
  createProject,
  deleteProject,
  listProjectsForUser,
  updateProject,
} from "~/lib/projects.server";

export type ProjectsActionData = {
  errors?: {
    form?: string;
    name?: string;
    projectId?: string;
    status?: string;
  };
  values?: {
    description: string;
    name: string;
    projectId?: string;
    status?: string;
  };
};

const projectStatusSchema = z.enum(
  [PROJECT_STATUS.active, PROJECT_STATUS.archived],
  {
    error: "Project status must be active or archived",
  },
);

const projectFieldsSchema = z.object({
  description: z
    .string()
    .trim()
    .transform((value) => (value.length > 0 ? value : null)),
  name: z.string().trim().min(1, "Project name is required"),
});

const projectUpdateSchema = projectFieldsSchema.extend({
  projectId: z.string().trim().min(1, "Project id is required"),
  status: projectStatusSchema,
});

export async function loadProjectsPage(request: Request) {
  const session = await requireAuth(request);
  const projects = await listProjectsForUser(session.user.id);

  return {
    projects,
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
  };
}

export async function handleProjectsAction(request: Request) {
  const session = await requireAuth(request);
  const formData = await request.formData();
  const intent = String(formData.get("_intent") ?? "");

  if (intent === "create") {
    return handleCreateProject(formData, session.user.id);
  }

  if (intent === "update") {
    return handleUpdateProject(formData, session.user.id);
  }

  if (intent === "delete") {
    return handleDeleteProject(formData, session.user.id);
  }

  return data<ProjectsActionData>(
    { errors: { form: "Unsupported project action" } },
    { status: 400 },
  );
}

async function handleCreateProject(formData: FormData, ownerId: string) {
  const formValues = readProjectFormValues(formData);
  const parsed = projectFieldsSchema.safeParse(formValues);

  if (!parsed.success) {
    return data<ProjectsActionData>(
      {
        errors: {
          name: parsed.error.flatten().fieldErrors.name?.[0],
        },
        values: {
          name: formValues.name,
          description: formValues.description,
        },
      },
      { status: 400 },
    );
  }

  const { name, description } = parsed.data;
  await createProject({ ownerId, name, description });

  return redirect("/dashboard/projects");
}

async function handleUpdateProject(formData: FormData, ownerId: string) {
  const formValues = readProjectFormValues(formData);
  const parsed = projectUpdateSchema.safeParse(formValues);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return data<ProjectsActionData>(
      {
        errors: {
          name: fieldErrors.name?.[0],
          projectId: fieldErrors.projectId?.[0],
          status: fieldErrors.status?.[0],
        },
        values: {
          name: formValues.name,
          description: formValues.description,
          projectId: formValues.projectId,
          status: formValues.status,
        },
      },
      { status: 400 },
    );
  }

  const { projectId, name, description, status } = parsed.data;
  const project = await updateProject({
    ownerId,
    projectId,
    name,
    description,
    status,
  });

  if (!project) {
    throw new Response("Project not found", { status: 404 });
  }

  return redirect("/dashboard/projects");
}

async function handleDeleteProject(formData: FormData, ownerId: string) {
  const projectId = readFormString(formData, "projectId");

  if (!projectId) {
    return data<ProjectsActionData>(
      { errors: { projectId: "Project id is required" } },
      { status: 400 },
    );
  }

  const deleted = await deleteProject({ ownerId, projectId });

  if (!deleted) {
    throw new Response("Project not found", { status: 404 });
  }

  return redirect("/dashboard/projects");
}

function readProjectFormValues(formData: FormData) {
  return {
    description: readFormString(formData, "description"),
    name: readFormString(formData, "name"),
    projectId: readFormString(formData, "projectId"),
    status: readFormString(formData, "status") || PROJECT_STATUS.active,
  };
}

function readFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}
