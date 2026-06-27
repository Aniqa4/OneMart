import { useEffect } from "react";
import Card from "~/components/Card";
import Title from "~/components/Title";
import { ProductGridSkeleton } from "~/components/CardSkeleton";
import useHomeStore from "~/store/home/useHomeStore";

function Popular() {
  const { popularProducts, popularLoading, popularError, fetchPopular } =
    useHomeStore();

  useEffect(() => {
    fetchPopular();
  }, [fetchPopular]);

  if (!popularLoading && popularProducts.length === 0) return null;

  return (
    <div>
      <Title title="Popular" />

      {popularLoading && <ProductGridSkeleton count={4} />}

      {!popularLoading && popularError && (
        <p className="text-red-500">{popularError}</p>
      )}

      {!popularLoading && !popularError && popularProducts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {popularProducts.map((product) => (
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

export default Popular;
