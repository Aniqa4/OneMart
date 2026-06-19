import Layout from "~/layout/Layout";
import type { Route } from "./+types/verifyEmail";
import VerifyEmail from "~/pages/verifyEmail/VerifyEmail";

export function meta({}: Route.MetaArgs) {
  return [{ title: "eCommerce - Verify Email" }];
}

export default function verifyEmail() {
  return (
    <Layout>
      <VerifyEmail />
    </Layout>
  );
}
