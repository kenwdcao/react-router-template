import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("api/auth/*", "routes/api.auth.$.ts"),
  layout("routes/marketing/layout.tsx", [index("routes/home.tsx")]),
  layout("routes/auth/layout.tsx", [
    route("login", "routes/auth/login.tsx"),
    route("register", "routes/auth/register.tsx"),
  ]),
  route("dashboard", "routes/dashboard/layout.tsx", [
    index("routes/dashboard/index.tsx"),
    route("projects", "routes/dashboard/projects.tsx"),
  ]),
] satisfies RouteConfig;
