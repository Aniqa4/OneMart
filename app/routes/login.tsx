import Layout from "~/layout/Layout";
import type { Route } from "./+types/login";
import Login from "~/pages/login/Login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "eCommerce - Login" },
    { name: "description", content: "Get your miniature trophy!" },
  ];
}

function login() {
  return (
    <Layout>
      <Login />
    </Layout>
  );
}

export default login;
