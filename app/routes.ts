import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("*", "routes/errorPage.tsx"),
  route("details/:id", "routes/details.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("checkout", "routes/checkout.tsx"),
  route("categories/:id/:categoryName", "routes/categories.tsx"),
  route("verify-email", "routes/verifyEmail.tsx"),
] satisfies RouteConfig;
