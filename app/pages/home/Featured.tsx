import { useEffect } from "react";
import Card from "~/components/Card";
import Title from "~/components/Title";
import { ProductGridSkeleton } from "~/components/CardSkeleton";
import useHomeStore from "~/store/home/useHomeStore";

function Featured() {
  const { featuredProducts, featuredLoading, featuredError, fetchFeatured } =
    useHomeStore();

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  if (!featuredLoading && !featuredError && featuredProducts.length === 0) {
    return null;
  }

  return (
    <div>
      <Title title="Featured" />

      {featuredLoading && <ProductGridSkeleton count={4} />}

      {!featuredLoading && featuredError && (
        <p className="text-red-500">{featuredError}</p>
      )}

      {!featuredLoading && !featuredError && featuredProducts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featuredProducts.map((product) => (
            <Card
              key={product._id}
              productID={product._id}
              name={product.productName}
              price={product.price}
              discountedPrice={product.discountedPrice}
              finalPrice={product.finalPrice}
              imageUrl={product.productImage[0]}
              quantity={product.availableQuantity}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Featured;
