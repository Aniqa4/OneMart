import type { Route } from "./+types/home";
import Layout from "~/layout/Layout";
import HeroBanner from "~/pages/home/HeroBanner";
import TrustStrip from "~/pages/home/TrustStrip";
import Featured from "~/pages/home/Featured";
import CategoryShowcase from "~/pages/home/CategoryShowcase";
import Popular from "~/pages/home/Popular";
import PromoBanner from "~/pages/home/PromoBanner";
import AllProducts from "~/pages/home/AllProducts";
import Newsletter from "~/pages/home/Newsletter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "eCommerce" },
    { name: "description", content: "Welcome to eCommerce! where creativity meets craftsmanship." },
  ];
}

export default function Home() {
  return (
    <Layout>
      <HeroBanner />
      <TrustStrip />
      <Featured />
      <CategoryShowcase />
      <Popular />
      <PromoBanner />
      <AllProducts />
      <Newsletter />
    </Layout>
  );
}
