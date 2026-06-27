import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { CgShoppingBag } from "react-icons/cg";
import useCountCartItems from "~/store/cart/countCartItems";
import useWishlistStore from "~/store/wishlist/useWishlistStore";
import useAuthStore from "~/store/auth/useAuthStore";
import type { ProductProps } from "~/interface/ProductProps";

type Variant = ProductProps["variants"][number];

interface CardProps {
  productID: string;
  name: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  discountedPrice: number;
  finalPrice: number;
  hasVariants?: boolean;
  variants?: Variant[];
}

function Card({
  productID,
  name,
  price,
  discountedPrice,
  finalPrice,
  imageUrl,
  inStock,
  hasVariants = false,
  variants = [],
}: CardProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addItem } = useCountCartItems();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const wishlisted = isWishlisted(productID);
  const discountPct = discountedPrice > 0 ? Math.round(((price - finalPrice) / price) * 100) : 0;

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated()) {
      toast.info("Sign in to save to your wishlist");
      return;
    }
    try {
      if (wishlisted) {
        await removeFromWishlist(productID);
      } else {
        await addToWishlist(productID);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVariant(null);
    setSelectedSize(null);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    setSelectedSize(null);
  };

  const canAdd = () => {
    if (!selectedVariant) return false;
    if (!selectedVariant.inStock) return false;
    if (selectedVariant.hasSizes && !selectedSize) return false;
    if (selectedVariant.hasSizes) {
      return selectedVariant.sizes.find((s) => s.label === selectedSize)?.inStock ?? false;
    }
    return true;
  };

  const handleAddFromModal = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canAdd() || !selectedVariant) return;
    await addItem({
      productId: productID,
      quantity: 1,
      variantLabel: selectedVariant.label,
      sizeLabel: selectedSize ?? undefined,
      productName: name,
      productImage: selectedVariant.image || imageUrl,
      price,
      discountedPrice,
      finalPrice,
    });
    closeModal();
    toast.success("Added to cart");
  };

  const handleDirectAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: productID,
      quantity: 1,
      productName: name,
      productImage: imageUrl,
      price,
      finalPrice,
    });
    toast.success("Added to cart");
  };

  const getModalButtonLabel = () => {
    if (!selectedVariant) return "Select a color";
    if (selectedVariant.hasSizes && !selectedSize) return "Select a size";
    return "Add to Cart";
  };

  return (
    <>
      <Link to={`/details/${productID}`} className="group block">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">

          {/* Image */}
          <div className="relative overflow-hidden">
            <img
              src={imageUrl}
              alt={name}
              className="aspect-square w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Discount badge */}
            {discountPct > 0 && inStock && (
              <span className="absolute top-3 left-3 bg-[#7163cc] text-white text-[11px] font-bold px-2 py-1 rounded-lg leading-none">
                -{discountPct}%
              </span>
            )}

            {/* Wishlist button */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow transition z-10"
            >
              {wishlisted ? (
                <GoHeartFill className="text-red-500" size={15} />
              ) : (
                <GoHeart className="text-gray-400 hover:text-red-400" size={15} />
              )}
            </button>

            {/* Sold out overlay */}
            {!inStock && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-white/90 text-gray-800 font-semibold text-xs px-4 py-2 rounded-full tracking-wide uppercase">
                  Sold Out
                </span>
              </div>
            )}

            {/* Add to cart — slides up on hover */}
            {inStock && (
              <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                <button
                  onClick={hasVariants ? openModal : handleDirectAdd}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900/90 backdrop-blur-sm text-white py-3 text-sm font-semibold hover:bg-[#7163cc] transition-colors duration-200"
                >
                  <CgShoppingBag size={16} />
                  {hasVariants ? "Select Options" : "Add to Cart"}
                </button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="px-4 pt-3 pb-4">
            <p className="text-sm font-medium text-gray-800 truncate leading-snug">{name}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-base font-bold text-gray-900">{finalPrice} BDT</span>
              {discountedPrice > 0 && (
                <span className="text-xs text-gray-400 line-through">{price} BDT</span>
              )}
            </div>
          </div>

        </div>
      </Link>

      {/* Variant selection modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 truncate pr-4">{name}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 shrink-0">
                ✕
              </button>
            </div>

            {/* Color variants */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                {selectedVariant ? `Color: ${selectedVariant.label}` : "Select Color"}
              </p>
              <div className="flex gap-2 flex-wrap">
                {variants.map((variant) => (
                  <button
                    key={variant.label}
                    title={variant.label}
                    onClick={() => handleVariantSelect(variant)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                      selectedVariant?.label === variant.label
                        ? "border-[#7163cc] scale-105 shadow-md"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img src={variant.image} alt={variant.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            {selectedVariant?.hasSizes && selectedVariant.sizes.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {selectedSize ? `Size: ${selectedSize}` : "Select Size"}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {selectedVariant.sizes.map((size) => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size.label)}
                      disabled={!size.inStock}
                      className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition ${
                        selectedSize === size.label
                          ? "bg-[#7163cc] text-white border-[#7163cc]"
                          : !size.inStock
                            ? "border-gray-200 text-gray-300 cursor-not-allowed line-through"
                            : "border-gray-200 hover:border-[#7163cc] hover:text-[#7163cc]"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddFromModal}
              disabled={!canAdd()}
              className="w-full py-3 rounded-xl bg-[#7163cc] text-white text-sm font-semibold hover:bg-[#5e50b5] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {getModalButtonLabel()}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Card;
