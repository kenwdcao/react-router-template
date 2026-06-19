import { data } from "react-router";
import { NotFoundPage } from "~/ui/components/common";
import type { Route } from "./+types/not-found";

export function loader({ url }: Route.LoaderArgs) {
  const pathname = url.pathname;

  if (pathname === "/api" || pathname.startsWith("/api/")) {
    throw data({ error: "Not found." }, { status: 404 });
  }

  return data(null, { status: 404 });
}

export function meta() {
  return [{ title: "Page Not Found" }];
}

export default function NotFoundRoute() {
  return <NotFoundPage />;
}
