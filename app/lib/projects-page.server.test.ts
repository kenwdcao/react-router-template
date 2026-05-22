import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireAuth } from "~/lib/auth/index.server";
import {
  handleProjectsAction,
  loadProjectsPage,
} from "~/lib/projects-page.server";
import {
  createProject,
  listProjectsForUser,
  updateProject,
} from "~/lib/projects.server";

vi.mock("~/lib/auth/require-auth.server", () => ({
  requireAuth: vi.fn(),
}));

vi.mock("~/lib/projects.server", () => ({
  PROJECT_STATUS: { active: "active", archived: "archived" },
  createProject: vi.fn(),
  deleteProject: vi.fn(),
  listProjectsForUser: vi.fn(),
  updateProject: vi.fn(),
}));

const requireAuthMock = vi.mocked(requireAuth);
const listProjectsForUserMock = vi.mocked(listProjectsForUser);
const createProjectMock = vi.mocked(createProject);
const updateProjectMock = vi.mocked(updateProject);

describe("loadProjectsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads projects for the authenticated user", async () => {
    requireAuthMock.mockResolvedValueOnce({
      session: { id: "session-id" },
      user: { id: "user-id", email: "user@example.com", name: "User" },
    } as never);
    listProjectsForUserMock.mockResolvedValueOnce([
      {
        id: "project-id",
        name: "Project",
        description: null,
        status: "active",
        createdAt: new Date("2026-01-01"),
        updatedAt: new Date("2026-01-01"),
      },
    ]);

    await expect(
      loadProjectsPage(new Request("http://localhost:5173/dashboard/projects")),
    ).resolves.toMatchObject({
      projects: [{ id: "project-id", name: "Project" }],
      user: { id: "user-id" },
    });
    expect(listProjectsForUserMock).toHaveBeenCalledWith("user-id");
  });
});

describe("handleProjectsAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAuthMock.mockResolvedValue({
      session: { id: "session-id" },
      user: { id: "user-id", email: "user@example.com", name: "User" },
    } as never);
  });

  it("returns validation errors for missing project names", async () => {
    const body = new URLSearchParams({ _intent: "create", name: "" });
    const response = await handleProjectsAction(
      new Request("http://localhost:5173/dashboard/projects", {
        method: "POST",
        body,
      }),
    );

    expect(createProjectMock).not.toHaveBeenCalled();
    expect(response).not.toBeInstanceOf(Response);
    if (response instanceof Response) {
      throw new Error("Expected validation data");
    }
    expect(response.init?.status).toBe(400);
    expect(response.data).toMatchObject({
      errors: { name: "Project name is required" },
    });
  });

  it("returns validation errors for unsupported project statuses", async () => {
    const body = new URLSearchParams({
      _intent: "update",
      projectId: "project-id",
      name: "Project",
      description: "Description",
      status: "archivd",
    });
    const response = await handleProjectsAction(
      new Request("http://localhost:5173/dashboard/projects", {
        method: "POST",
        body,
      }),
    );

    expect(updateProjectMock).not.toHaveBeenCalled();
    expect(response).not.toBeInstanceOf(Response);
    if (response instanceof Response) {
      throw new Error("Expected validation data");
    }
    expect(response.init?.status).toBe(400);
    expect(response.data).toMatchObject({
      errors: { status: "Project status must be active or archived" },
      values: { projectId: "project-id" },
    });
  });
});
