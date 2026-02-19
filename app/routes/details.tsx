import Layout from "~/layout/Layout";
import type { Route } from "./+types/details";
import { useParams } from "react-router";
import ProductDetails from "~/pages/details/ProductDetails";
import ErrorPage from "~/pages/notFoundPage/ErrorPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GetProducts - Product details" },
    { name: "description", content: "Get your miniature trophy!" },
  ];
}

function details() {
  const { id } = useParams();

  if (!id) return <ErrorPage />;

  return (
    <Layout>
      <ProductDetails id={id} />
    </Layout>
  );
}

export default details;
