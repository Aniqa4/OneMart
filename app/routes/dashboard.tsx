import Layout from "~/layout/Layout";
import type { Route } from "./+types/dashboard";
import UserDashboard from "~/pages/dashboard/UserDashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GetProducts - Dashboard" },
    { name: "description", content: "Get your miniature trophy!" },
  ];
}

function dashboard() {
  return (
    <Layout>
      <UserDashboard />
    </Layout>
  );
}

export default dashboard;
