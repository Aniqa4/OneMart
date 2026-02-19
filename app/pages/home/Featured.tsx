import { useEffect, useState } from "react";
import Card from "~/components/Card";
import Title from "~/components/Title";
import type { ProductProps } from "~/interface/ProductProps";
import axiosInstance from "~/utilities/axiosInstance";

function Featured() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axiosInstance.get("/featured-products");
        setProducts(response.data || []);
      } catch (err) {
        setError("Failed to load featured products.");
        console.error("Featured API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Hide entire section if:
  // not loading, no error, and no products found
  if (!loading && !error && products.length === 0) {
    return null;
  }

  return (
    <div>
      <Title title="Featured" />

      {loading && <p className="text-gray-600">Loading...</p>}

      {!loading && error && <p className="text-red-500">{error}</p>}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((product) => (
            <Card
              key={product._id}
              productID={product._id}
              name={product.productName}
              price={product.price}
              discountedPrice={product.discountedPrice}
              finalPrice={product.finalPrice}
              imageUrl={product.productImage}
              quantity={product.availableCopies}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Featured;
