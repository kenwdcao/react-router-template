import { useEffect } from "react";
import { z } from "zod";
import { getAdminErrorInfo } from "~/lib/admin/errors";
import {
  banUser,
  getUserById,
  getUserCount,
  getUsersWithLastLogin,
  unbanUser,
} from "~/lib/admin/users.server";
import { isAdminEmail, requireAdmin } from "~/lib/auth/index.server";
import { formatDateTime } from "~/lib/utils";
import { AdminErrorBoundary, AdminUsersView } from "~/ui/admin";
import { useNotificationOnce } from "~/ui/hooks";
import type { Route } from "./+types/users";

const actionSchema = z.discriminatedUnion("_intent", [
  z.object({ _intent: z.literal("ban"), userId: z.string() }),
  z.object({ _intent: z.literal("unban"), userId: z.string() }),
]);

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export function meta() {
  return [{ title: "Admin | User Management" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const currentUser = await requireAdmin(request);
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(
      1,
      parseInt(
        url.searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE),
        10,
      ),
    ),
  );
  const searchQuery = url.searchParams.get("search")?.trim() || undefined;

  const [users, totalCount] = await Promise.all([
    getUsersWithLastLogin(page, pageSize, searchQuery),
    getUserCount(searchQuery),
  ]);

  // Derive the displayed role from the env allow-list so the env stays the
  // source of truth; the list itself never crosses to the client.
  const usersWithDisplayRole = users.map((user) => ({
    ...user,
    displayRole: isAdminEmail(user.email) ? "admin" : user.role,
  }));

  return {
    users: usersWithDisplayRole,
    currentUserId: currentUser.user.id,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
    searchQuery,
  };
}

export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request);
  const formData = Object.fromEntries(await request.formData());
  const result = actionSchema.safeParse(formData);
  if (!result.success) {
    return {
      success: false,
      message: `Invalid input: ${result.error.message}`,
      notificationId: crypto.randomUUID(),
    };
  }

  const { _intent, userId } = result.data;
  const actionLabel = _intent === "ban" ? "banned" : "unbanned";
  const user = await getUserById(userId);
  const userName = user?.name ?? "Unknown User";
  const userEmail = user?.email ?? "";

  try {
    if (_intent === "ban") await banUser(userId);
    else await unbanUser(userId);
    return {
      success: true,
      notificationId: crypto.randomUUID(),
      message: `User "${userName}" (${userEmail}) successfully ${actionLabel}`,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: `Failed to ${_intent} user "${userName}" (${userEmail}): ${errorMessage}`,
      notificationId: crypto.randomUUID(),
    };
  }
}

interface UsersActionData {
  success: boolean;
  message: string;
  notificationId: string;
}

export default function AdminUsersPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { users, currentUserId, pagination } = loaderData;
  const showNotificationOnce = useNotificationOnce();
  const typedActionData = actionData as UsersActionData | undefined;

  useEffect(() => {
    if (!typedActionData) return;
    showNotificationOnce({
      id: typedActionData.notificationId,
      title: typedActionData.success ? "Success" : "Error",
      message: typedActionData.message,
      color: typedActionData.success ? "green" : "red",
      position: "top-right",
    });
    // Re-fire only when the action result fields change, not every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    typedActionData?.message,
    typedActionData?.success,
    typedActionData?.notificationId,
    showNotificationOnce,
  ]);

  return (
    <AdminUsersView
      users={users}
      currentUserId={currentUserId}
      pagination={pagination}
      formatDate={formatDateTime}
    />
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { title, message, showLoginLink } = getAdminErrorInfo(
    error,
    "admin users",
  );
  return (
    <AdminErrorBoundary
      title={title}
      message={message}
      showLoginLink={showLoginLink}
    />
  );
}
