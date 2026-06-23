import React, { useEffect, useMemo, useState } from "react";
import Card from "~/components/Card";
import type { ProductProps } from "~/interface/ProductProps";
import axiosInstance from "~/utilities/axiosInstance";

export default function Categories({
  categoryID,
  categoryName,
}: {
  categoryID: string | undefined;
  categoryName: string | undefined;
}) {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [filter, setFilter] = useState("default");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  /* ================= Fetch products ================= */
  useEffect(() => {
    if (!categoryID) return;

    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(
          `/products-by-category/${categoryID}`,
        );
        console.log("data:", response.data.products);

        setProducts(Array.isArray(response.data.products) ? response.data.products : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryID]);

  /* ================= Filters ================= */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    switch (filter) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "in-stock":
        result = result.filter((p) => p.availableQuantity > 0);
        break;

      case "default":
      default:
        break;
    }

    return result;
  }, [filter, products]);

  /* ================= UI ================= */
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-5 mb-8 gap-4">
        <h1 className="text-3xl font-bold">{categoryName || "Products"}</h1>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="default">Default</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="in-stock">In Stock</option>
        </select>
      </div>

      {/* States */}
      {loading && (
        <p className="text-center text-gray-500 mt-20">Loading products…</p>
      )}

      {error && <p className="text-center text-red-500 mt-20">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center mt-20 italic">
              No products available.
            </p>
          ) : (
            filteredProducts.map((product) => (
              <Card
                key={product._id}
                productID={product._id}
                name={product.productName}
                price={product.price}
                quantity={product.availableQuantity}
                imageUrl={product.productImage[0] || ""}
                discountedPrice={product.discountedPrice}
                finalPrice={product.finalPrice}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
