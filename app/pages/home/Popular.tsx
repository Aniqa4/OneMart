import { useEffect } from "react";
import Card from "~/components/Card";
import Title from "~/components/Title";
import useHomeStore from "~/store/home/useHomeStore";

function Popular() {
  const { popularProducts, popularLoading, popularError, fetchPopular } =
    useHomeStore();

  useEffect(() => {
    fetchPopular();
  }, [fetchPopular]);

  return (
    <div>
      <Title title="Popular" />

      {popularLoading && <p className="text-gray-600">Loading...</p>}

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
              imageUrl={product.productImage}
              quantity={product.availableCopies}
            />
          ))}
        </div>
      )}

      {popularProducts.length === 0 && !popularLoading && (
        <p>No products to show.</p>
      )}
    </div>
  );
}

export default Popular;
