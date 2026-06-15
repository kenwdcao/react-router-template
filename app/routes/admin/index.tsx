import { redirect } from "react-router";
import { requireAdmin } from "~/lib/auth/index.server";
import type { Route } from "./+types/index";

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
  throw redirect("/admin/users");
}
