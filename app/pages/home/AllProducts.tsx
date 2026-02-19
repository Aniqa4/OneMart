import { useEffect, useState } from "react";
import Card from "~/components/Card";
import Title from "~/components/Title";
import type { ProductProps } from "~/interface/ProductProps";
import axiosInstance from "~/utilities/axiosInstance";

function AllProducts() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const response = await axiosInstance.get("/products");
        setProducts(response.data || []);
      } catch (err) {
        setError("Failed to load popular products.");
        console.error("Popular API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  return (
    <div>
      <Title title="All Products" />

      {loading && <p className="text-gray-600">Loading...</p>}

      {!loading && error && (
        <p className="text-red-500">{error}</p>
      )}

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

      {
        products.length===0 && <p>No products to show.</p>
      }
    </div>
  );
}

export default AllProducts;