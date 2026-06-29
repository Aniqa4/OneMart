import Layout from "~/layout/Layout";
import type { Route } from "./+types/forgotPassword";
import ForgotPassword from "~/pages/forgotPassword/ForgotPassword";

export function meta({}: Route.MetaArgs) {
  return [{ title: "eCommerce - Forgot Password" }];
}

export default function forgotPasswordRoute() {
  return (
    <Layout>
      <ForgotPassword />
    </Layout>
  );
}
