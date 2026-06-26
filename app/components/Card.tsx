import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router";
import useCountCartItems from "~/store/cart/countCartItems";
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
  const [showText, setShowText] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addItem } = useCountCartItems();

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
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
      <Link to={`/details/${productID}`}>
        <div className="p-3 bg-gray-50 grid grid-cols-1 rounded-md shadow-sm">
          <div
            onMouseEnter={() => inStock && setShowText(true)}
            onMouseLeave={() => setShowText(false)}
            className="relative"
          >
            <img
              src={imageUrl}
              alt={name}
              className="aspect-square object-cover rounded"
            />
            {inStock === false ? (
              <div className="absolute inset-0 bg-black opacity-60 flex items-center justify-center text-white text-xl font-bold rounded">
                Sold Out
              </div>
            ) : (
              showText && (
                <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold rounded transition-opacity duration-200">
                  View details
                </div>
              )
            )}
          </div>

          <div className="py-3 grid gap-5">
            <p className="font-medium text-lg">{name}</p>
            <p>
              Price:
              {discountedPrice && (
                <span className="line-through text-gray-600"> {price} BDT</span>
              )}{" "}
              {finalPrice} BDT
            </p>
          </div>

          {inStock ? (
            <button
              onClick={hasVariants ? openModal : handleDirectAdd}
              className="w-full rounded py-1 font-medium cursor-pointer bg-gray-200 hover:bg-gray-300 uppercase"
            >
              Add to cart
            </button>
          ) : (
            <button
              onClick={(e) => e.preventDefault()}
              className="w-full rounded py-1 font-medium bg-gray-600 text-white hover:bg-gray-700 cursor-pointer uppercase"
            >
              Add to Wishlist
            </button>
          )}
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
              <h3 className="font-semibold text-gray-900 truncate pr-4">
                {name}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-700 shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Color variants */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 capitalize">
                {selectedVariant
                  ? `Color: ${selectedVariant.label}`
                  : "Select Color"}
              </p>
              <div className="flex gap-2 flex-wrap">
                {variants.map((variant) => (
                  <button
                    key={variant.label}
                    title={variant.label}
                    onClick={() => handleVariantSelect(variant)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition ${
                      selectedVariant?.label === variant.label
                        ? "border-gray-800 scale-105 shadow-md"
                        : "border-transparent hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={variant.image}
                      alt={variant.label}
                      className="w-full h-full object-cover"
                    />
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
                      className={`px-4 py-1.5 rounded border text-sm font-medium transition ${
                        selectedSize === size.label
                          ? "bg-gray-800 text-white border-gray-800"
                          : !size.inStock
                            ? "border-gray-200 text-gray-300 cursor-not-allowed line-through"
                            : "border-gray-300 hover:border-gray-700"
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
              className="w-full py-2.5 rounded-xl bg-gray-800 text-white text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-40 disabled:cursor-not-allowed"
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
