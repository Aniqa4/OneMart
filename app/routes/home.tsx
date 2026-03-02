import Featured from "~/pages/home/Featured";
import type { Route } from "./+types/home";
import Layout from "~/layout/Layout";
import Popular from "~/pages/home/Popular";
import Banner from "~/pages/home/Banner";
import AllProducts from "~/pages/home/AllProducts";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "eCommerce" },
    {
      name: "description",
      content:
        " Welcome to eCommerce! where creativity meets craftsmanship.",
    },
  ];
}

export default function Home() {
  return (
    <Layout>
     {/*  <Banner />
      <Featured />
      <Popular /> */}
      <AllProducts />
    </Layout>
  );
}
