import {
  redirect,
  useActionData,
  useLoaderData,
  useSearchParams,
} from "react-router";
import {
  auth,
  getAuthErrorMessage,
  requireAuth,
} from "~/lib/auth/index.server";
import { readFormString } from "~/lib/utils";
import { SettingsTabs } from "~/ui/components/dashboard/settings";
import type { Route } from "./+types/settings";

export function meta() {
  return [{ title: "Settings" }];
}

interface SettingsLoaderData {
  user: { name: string; email: string };
  success?: string;
}

interface SettingsActionData {
  errors?: Record<string, string>;
}

export async function loader({
  request,
}: Route.LoaderArgs): Promise<SettingsLoaderData> {
  const session = await requireAuth(request);
  const url = new URL(request.url);
  const success = url.searchParams.get("updated") ?? undefined;

  return {
    user: {
      name: session.user.name,
      email: session.user.email,
    },
    success,
  };
}

export async function action({
  request,
}: Route.ActionArgs): Promise<Response | SettingsActionData> {
  await requireAuth(request);
  const formData = await request.formData();
  const intent = readFormString(formData, "_intent");

  if (intent === "profile") {
    const name = readFormString(formData, "name");
    if (!name) {
      return { errors: { name: "Name is required" } };
    }
    if (name.length > 100) {
      return { errors: { name: "Name must be 100 characters or less" } };
    }
    try {
      await auth.api.updateUser({
        headers: request.headers,
        body: { name },
      });
      return redirect("/dashboard/settings?updated=profile");
    } catch (error) {
      return {
        errors: {
          form: getAuthErrorMessage(error, "Failed to update profile"),
        },
      };
    }
  }

  return { errors: { form: "Unknown action" } };
}

export default function SettingsRoute() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [, setSearchParams] = useSearchParams();

  return (
    <SettingsTabs
      user={loaderData.user}
      actionData={actionData}
      success={loaderData.success}
      onDismissSuccess={() => setSearchParams({}, { replace: true })}
    />
  );
}
