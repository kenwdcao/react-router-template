import { data } from "react-router";
import { getAdminErrorInfo } from "~/lib/admin/errors";
import {
  createProject,
  getProjectCount,
  getProjectManagers,
  getProjectsWithManagers,
  getUniqueClients,
  setProjectArchiveStatus,
  updateProject,
} from "~/lib/admin/projects.server";
import { requireAdmin } from "~/lib/auth/index.server";
import {
  formatDate,
  parseIntegerParam,
  readFormString,
  readFormStringArray,
} from "~/lib/utils";
import { AdminErrorBoundary, AdminProjectsPage } from "~/ui/admin";
import type { Route } from "./+types/projects";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export function meta() {
  return [{ title: "Admin | Project Management" }];
}

export async function loader({ request, url }: Route.LoaderArgs) {
  await requireAdmin(request, url.pathname);
  const page = Math.max(1, parseIntegerParam(url.searchParams.get("page"), 1));
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(
      1,
      parseIntegerParam(url.searchParams.get("pageSize"), DEFAULT_PAGE_SIZE),
    ),
  );
  const searchQuery = url.searchParams.get("search")?.trim() || undefined;

  const [projects, totalCount, clients, availableManagers] = await Promise.all([
    getProjectsWithManagers(page, pageSize, searchQuery),
    getProjectCount(searchQuery),
    getUniqueClients(),
    getProjectManagers(),
  ]);

  return {
    projects,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
    clients,
    availableManagers,
  };
}

export async function action({ request, url }: Route.ActionArgs) {
  const currentUser = await requireAdmin(request, url.pathname);
  const formData = await request.formData();
  const intent = formData.get("_intent");

  if (intent === "createProject") {
    const name = readFormString(formData, "name");
    const slug = readFormString(formData, "slug");
    const client = readFormString(formData, "client");
    const description = readFormString(formData, "description");
    const managerIds = readFormStringArray(formData, "managerIds");

    const result = await createProject(
      { name, slug, client, description, managerIds },
      currentUser.user.id,
    );
    if (!result.success) {
      return data({ success: false, error: result.error }, { status: 400 });
    }
    return data({ success: true });
  }

  if (intent === "updateProject") {
    const projectId = readFormString(formData, "projectId");
    const name = readFormString(formData, "name");
    const slug = readFormString(formData, "slug");
    const client = readFormString(formData, "client");
    const description = readFormString(formData, "description");
    const managerIds = readFormStringArray(formData, "managerIds");

    const result = await updateProject({
      projectId,
      name,
      slug,
      client,
      description,
      managerIds,
    });
    if (!result.success) {
      return data({ success: false, error: result.error }, { status: 400 });
    }
    return data({ success: true });
  }

  if (intent === "archiveProject" || intent === "unarchiveProject") {
    const projectId = readFormString(formData, "projectId");
    const archived = intent === "archiveProject";
    const result = await setProjectArchiveStatus(projectId, archived);
    if (!result.success) {
      return data({ success: false, error: result.error }, { status: 400 });
    }
    return data({ success: true });
  }

  return data({ success: false, error: "Unknown intent" }, { status: 400 });
}

export default function AdminProjectsRoute({
  loaderData,
}: Route.ComponentProps) {
  const { projects, pagination, clients, availableManagers } = loaderData;
  return (
    <AdminProjectsPage
      projects={projects}
      pagination={pagination}
      clients={clients}
      availableManagers={availableManagers}
      formatDate={formatDate}
    />
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { title, message, showLoginLink } = getAdminErrorInfo(
    error,
    "admin projects",
  );
  return (
    <AdminErrorBoundary
      title={title}
      message={message}
      showLoginLink={showLoginLink}
    />
  );
}
