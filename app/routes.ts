import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("health", "routes/health.ts"),
  route("api/auth/*", "routes/api.auth.$.ts"),
  layout("routes/marketing/layout.tsx", [
    index("routes/home.tsx"),
    route("*", "routes/not-found.tsx"),
  ]),
  layout("routes/auth/layout.tsx", [
    route("login", "routes/auth/login.tsx"),
    route("register", "routes/auth/register.tsx"),
  ]),
  route("dashboard", "routes/dashboard/layout.tsx", [
    index("routes/dashboard/index.tsx"),
    route("projects", "routes/dashboard/projects.tsx"),
    route("activity", "routes/dashboard/activity.tsx"),
    route("settings", "routes/dashboard/settings.tsx"),
    route("components", "routes/dashboard/components.tsx"),
  ]),
  route("api/chat", "routes/api.chat.ts"),
] satisfies RouteConfig;
