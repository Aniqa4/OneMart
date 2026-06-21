import type { Route } from "./+types/search";
import Layout from "~/layout/Layout";
import Search from "~/pages/search/Search";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Search: ${params.name} - eCommerce` },
    { name: "description", content: `Search results for ${params.name}` },
  ];
}

function SearchRoute() {
  return (
    <Layout>
      <Search />
    </Layout>
  );
}

export default SearchRoute;
