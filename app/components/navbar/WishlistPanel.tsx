import { GoHeart, GoHeartFill } from "react-icons/go";
import { Link } from "react-router";
import { toast } from "react-toastify";
import useWishlistStore from "~/store/wishlist/useWishlistStore";

interface Props {
  onClose: () => void;
}

export default function WishlistPanel({ onClose }: Props) {
  const { wishlistProducts, loading, removeFromWishlist } = useWishlistStore();

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
    } catch {
      toast.error("Failed to remove from wishlist");
    }
  };

  return (
    <div className="absolute right-0 top-[calc(100%+8px)] w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">Wishlist</h3>
        {wishlistProducts.length > 0 && (
          <span className="text-[10px] font-bold bg-red-500 text-white rounded-full px-1.5 py-0.5 leading-none">
            {wishlistProducts.length}
          </span>
        )}
      </div>

      {/* List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))
        ) : wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
            <GoHeart size={36} className="opacity-30" />
            <p className="text-sm">Your wishlist is empty</p>
          </div>
        ) : (
          wishlistProducts.map((product) => (
            <div key={product._id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition group">
              <Link
                to={`/details/${product._id}`}
                onClick={onClose}
                className="shrink-0"
              >
                <img
                  src={product.productImage[0]}
                  alt={product.productName}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              </Link>
              <Link
                to={`/details/${product._id}`}
                onClick={onClose}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-gray-800 truncate leading-snug">
                  {product.productName}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{product.finalPrice} BDT</p>
              </Link>
              <button
                onClick={() => handleRemove(product._id)}
                aria-label="Remove from wishlist"
                className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition shrink-0"
              >
                <GoHeartFill size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
