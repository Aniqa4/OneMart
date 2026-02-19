import Layout from "~/layout/Layout";
import type { Route } from "./+types/register";
import Register from "~/pages/register/Register";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GetProducts - Register" },
    { name: "description", content: "Get your miniature trophy!" },
  ];
}
function register() {
  return (
    <Layout>
      <Register />
    </Layout>
  );
}

export default register;
