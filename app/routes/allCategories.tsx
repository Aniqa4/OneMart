import type { Route } from "./+types/allCategories";
import Layout from "~/layout/Layout";
import AllCategories from "~/pages/allCategories/AllCategories";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "All Products - eCommerce" },
    { name: "description", content: "Browse all products" },
  ];
}

function AllCategoriesRoute() {
  return (
    <Layout>
      <AllCategories />
    </Layout>
  );
}

export default AllCategoriesRoute;
