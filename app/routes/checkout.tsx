import Layout from "~/layout/Layout";
import type { Route } from "./+types/checkout";
import Checkout from "~/pages/checkout/Checkout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GetProducts - Checkout" },
    { name: "description", content: "Get your miniature trophy!" },
  ];
}

function checkout() {
  return (
    <Layout>
      <Checkout />
    </Layout>
  );
}

export default checkout;
