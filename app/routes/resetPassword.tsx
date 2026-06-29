import Layout from "~/layout/Layout";
import type { Route } from "./+types/resetPassword";
import ResetPassword from "~/pages/resetPassword/ResetPassword";

export function meta({}: Route.MetaArgs) {
  return [{ title: "eCommerce - Reset Password" }];
}

export default function resetPasswordRoute() {
  return (
    <Layout>
      <ResetPassword />
    </Layout>
  );
}
