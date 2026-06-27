import { GoHeart } from "react-icons/go";
import { Link } from "react-router";
import Card from "~/components/Card";
import CardSkeleton from "~/components/CardSkeleton";
import useWishlistStore from "~/store/wishlist/useWishlistStore";

function Wishlist() {
  const { wishlistProducts, loading } = useWishlistStore();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Wishlist</h1>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && wishlistProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <GoHeart size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium mb-1">Your wishlist is empty</p>
          <p className="text-sm text-gray-400 mb-6">Save items you love and find them here.</p>
          <Link
            to="/"
            className="bg-gray-900 text-white text-sm font-medium px-6 py-2 rounded-md hover:bg-gray-700 transition"
          >
            Browse Products
          </Link>
        </div>
      )}

      {!loading && wishlistProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistProducts.map((product) => (
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

export default Wishlist;
