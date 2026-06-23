import React, { useEffect, useState } from "react";
import type { ProductProps } from "~/interface/ProductProps";
import useCountCartItems from "~/store/cart/countCartItems";
import axiosInstance from "~/utilities/axiosInstance";
import ErrorPage from "../notFoundPage/ErrorPage";

type Variant = ProductProps["variants"][number];

function ProductDetails({ id }: { id: string }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCountCartItems();
  const [product, setProduct] = useState<ProductProps>();
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        const data: ProductProps = response.data;
        setProduct(data);
        setActiveImage(data.productImage[0] || "");
      } catch (err) {
        console.error("Product API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  if (loading) return null;
  if (!product) return <ErrorPage />;

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    setSelectedSize(null);
    if (variant.image) setActiveImage(variant.image);
  };

  const getStock = (): number | null => {
    if (!product.hasVariants) return product.availableQuantity;
    if (!selectedVariant) return null;
    if (selectedVariant.hasSizes) {
      if (!selectedSize) return null;
      return selectedVariant.sizes.find((s) => s.label === selectedSize)?.quantity ?? 0;
    }
    return selectedVariant.quantity;
  };

  const stock = getStock();

  const getButtonLabel = () => {
    if (product.hasVariants && !selectedVariant) return "Select a color";
    if (selectedVariant?.hasSizes && !selectedSize) return "Select a size";
    if (stock === 0) return "Out of stock";
    return "Add to Cart";
  };

  const canAdd = stock !== null && stock > 0;

  const addToCart = () => {
    const name = selectedVariant
      ? selectedSize
        ? `${product.productName} – ${selectedVariant.label} / ${selectedSize}`
        : `${product.productName} – ${selectedVariant.label}`
      : product.productName;

    addItem({
      productID: id,
      name,
      price: product.finalPrice,
      imageUrl: activeImage || product.productImage[0],
      quantity,
      variantLabel: selectedVariant?.label,
      sizeLabel: selectedSize ?? undefined,
    });
    setQuantity(1);
    alert("Added to cart");
  };

  // All images: product images + variant images for the thumbnail strip
  const allThumbnails = [
    ...product.productImage,
    ...product.variants.map((v) => v.image).filter(Boolean),
  ];

  return (
    <div className="md:p-6 bg-white rounded-lg md:shadow-md mt-5">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Image gallery */}
        <div className="md:w-1/2 flex flex-col gap-3">
          <img
            src={activeImage}
            alt={product.productName}
            className="rounded-lg w-full aspect-square object-cover"
          />
          {allThumbnails.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {allThumbnails.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.productName} ${i + 1}`}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition ${
                    activeImage === img
                      ? "border-gray-800"
                      : "border-transparent hover:border-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="md:w-1/2 flex flex-col gap-5">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>
            <p className="mb-1">
              {product.discountedPrice && (
                <span className="line-through text-gray-500 mr-2">
                  {product.price} BDT
                </span>
              )}
              <span className="text-xl text-green-600 font-semibold">
                {product.finalPrice} BDT
              </span>
            </p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mt-3">
              {product.description}
            </p>
          </div>

          {/* Color variants */}
          {product.hasVariants && product.variants.length > 0 && (
            <div>
              <p className="font-medium mb-2 capitalize">
                {selectedVariant ? `Color: ${selectedVariant.label}` : "Select Color"}
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map((variant) => (
                  <button
                    key={variant.label}
                    title={variant.label}
                    onClick={() => handleVariantSelect(variant)}
                    className={`w-14 h-14 rounded overflow-hidden border-2 transition ${
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
          )}

          {/* Sizes */}
          {selectedVariant?.hasSizes && selectedVariant.sizes.length > 0 && (
            <div>
              <p className="font-medium mb-2">
                {selectedSize ? `Size: ${selectedSize}` : "Select Size"}
              </p>
              <div className="flex gap-2 flex-wrap">
                {selectedVariant.sizes.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSize(size.label)}
                    disabled={size.quantity === 0}
                    className={`px-4 py-1.5 rounded border text-sm font-medium transition ${
                      selectedSize === size.label
                        ? "bg-gray-800 text-white border-gray-800"
                        : size.quantity === 0
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

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                className="px-4 py-2 text-xl font-bold text-gray-700 hover:bg-gray-100 transition"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="text"
                readOnly
                value={quantity}
                className="w-12 text-center text-lg font-semibold border-l border-r border-gray-300 outline-none"
              />
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2 text-xl font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              disabled={!canAdd}
              onClick={addToCart}
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {getButtonLabel()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
