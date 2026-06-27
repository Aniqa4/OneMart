import { useEffect } from "react";
import Card from "~/components/Card";
import Title from "~/components/Title";
import { ProductGridSkeleton } from "~/components/CardSkeleton";
import useHomeStore from "~/store/home/useHomeStore";

function AllProducts() {
  const {
    allProducts,
    allProductsLoading,
    allProductsError,
    fetchAllProducts,
  } = useHomeStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  if (!allProductsLoading && allProducts.length === 0) return null;

  return (
    <div>
      <Title title="All Products" />

      {allProductsLoading && <ProductGridSkeleton count={8} />}

      {!allProductsLoading && allProductsError && (
        <p className="text-red-500">{allProductsError}</p>
      )}

      {!allProductsLoading && !allProductsError && allProducts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {allProducts.map((product) => (
            <Card
              key={product._id}
              productID={product._id}
              name={product.productName}
              price={product.price}
              discountedPrice={product.discountedPrice}
              finalPrice={product.finalPrice}
              imageUrl={product.productImage[0]}
              inStock={product.inStock}
              hasVariants={product.hasVariants}
              variants={product.variants}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default AllProducts;
