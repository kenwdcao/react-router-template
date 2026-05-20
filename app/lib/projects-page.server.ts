import { data, redirect } from "react-router";
import { requireAuth } from "~/lib/auth/require-auth.server";
import { PROJECT_STATUS, type ProjectStatus } from "~/lib/projects";
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
  };
  values?: {
    description: string;
    name: string;
  };
};

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
  const { name, description } = readProjectFields(formData);

  if (!name) {
    return data<ProjectsActionData>(
      {
        errors: { name: "Project name is required" },
        values: { name, description: description ?? "" },
      },
      { status: 400 },
    );
  }

  await createProject({ ownerId, name, description });

  return redirect("/dashboard/projects");
}

async function handleUpdateProject(formData: FormData, ownerId: string) {
  const projectId = String(formData.get("projectId") ?? "");
  const { name, description } = readProjectFields(formData);
  const status = readProjectStatus(formData);

  if (!projectId) {
    return data<ProjectsActionData>(
      { errors: { projectId: "Project id is required" } },
      { status: 400 },
    );
  }

  if (!name) {
    return data<ProjectsActionData>(
      { errors: { name: "Project name is required", projectId } },
      { status: 400 },
    );
  }

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
  const projectId = String(formData.get("projectId") ?? "");

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

function readProjectFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const rawDescription = String(formData.get("description") ?? "").trim();

  return {
    name,
    description: rawDescription.length > 0 ? rawDescription : null,
  };
}

function readProjectStatus(formData: FormData): ProjectStatus {
  const status = String(formData.get("status") ?? PROJECT_STATUS.active);

  if (status === PROJECT_STATUS.archived) {
    return PROJECT_STATUS.archived;
  }

  return PROJECT_STATUS.active;
}
