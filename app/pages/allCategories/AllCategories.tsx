import { useEffect, useMemo, useState } from "react";
import useHomeStore from "~/store/home/useHomeStore";
import Card from "~/components/Card";
import { ProductGridSkeleton } from "~/components/CardSkeleton";

function AllCategories() {
  const { allProducts, allProductsLoading, allProductsError, fetchAllProducts } =
    useHomeStore();
  const [filter, setFilter] = useState("default");

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    switch (filter) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "in-stock":
        result = result.filter((p) => p.availableCopies > 0);
        break;
    }
    return result;
  }, [filter, allProducts]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-5 mb-8 gap-4">
        <h1 className="text-3xl font-bold">All</h1>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="default">Default</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="in-stock">In Stock</option>
        </select>
      </div>

      {allProductsLoading && <ProductGridSkeleton count={20} />}

      {!allProductsLoading && allProductsError && (
        <p className="text-center text-red-500 mt-20">{allProductsError}</p>
      )}

      {!allProductsLoading && !allProductsError && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center mt-20 italic">
              No products available.
            </p>
          ) : (
            filteredProducts.map((p) => (
              <Card
                key={p._id || p.id}
                productID={p._id || p.id}
                name={p.productName}
                price={p.price}
                discountedPrice={p.discountedPrice}
                finalPrice={p.finalPrice}
                imageUrl={p.productImage}
                quantity={p.availableCopies}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AllCategories;
