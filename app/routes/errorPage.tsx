import ErrorPage from "~/pages/notFoundPage/ErrorPage";
import type { Route } from "./+types/errorPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "eCommerce - Page not found" },
    { name: "description", content: "Get your miniature trophy!" },
  ];
}

export default function errorPage() {
  return (
    <div>
      <ErrorPage />
    </div>
  );
}
