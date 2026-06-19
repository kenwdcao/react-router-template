import { redirect } from "react-router";
import { requireAdmin } from "~/lib/auth/index.server";
import type { Route } from "./+types/index";

export async function loader({ request, url }: Route.LoaderArgs) {
  await requireAdmin(request, url.pathname);
  throw redirect("/admin/users");
}
