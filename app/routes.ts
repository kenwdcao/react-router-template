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
  route("demo/dashboard", "routes/demo/dashboard/layout.tsx", [
    index("routes/demo/dashboard/index.tsx"),
    route("projects", "routes/demo/dashboard/projects.tsx"),
    route("activity", "routes/demo/dashboard/activity.tsx"),
    route("settings", "routes/demo/dashboard/settings.tsx"),
    route("components", "routes/demo/dashboard/components.tsx"),
  ]),
  route("api/chat", "routes/api.chat.ts"),
] satisfies RouteConfig;
