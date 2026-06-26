import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import Card from "~/components/Card";
import type { ProductProps } from "~/interface/ProductProps";
import useCountCartItems from "~/store/cart/countCartItems";
import { toast } from "react-toastify";
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
  const [relatedProducts, setRelatedProducts] = useState<ProductProps[]>([]);

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

  useEffect(() => {
    if (!product) return;
    const fetchRelated = async () => {
      try {
        const response = await axiosInstance.get(`/products-by-category/${product.categoryID}`);
        const all: ProductProps[] = response.data.products ?? [];
        setRelatedProducts(all.filter((p) => p._id !== product._id).slice(0, 4));
      } catch (err) {
        console.error("Related products error:", err);
      }
    };
    fetchRelated();
  }, [product?.categoryID]);

  if (loading) return null;
  if (!product) return <ErrorPage />;

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    setSelectedSize(null);
    if (variant.image) setActiveImage(variant.image);
  };

  const getStock = (): number | null => {
    if (!product.hasVariants) return product.inStock ? 1 : 0;
    if (!selectedVariant) return null;
    if (!selectedVariant.inStock) return 0;
    if (selectedVariant.hasSizes) {
      if (!selectedSize) return null;
      return (selectedVariant.sizes.find((s) => s.label === selectedSize)?.inStock ?? false) ? 1 : 0;
    }
    return 1;
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
    addItem({
      productId: id,
      quantity,
      variantLabel: selectedVariant?.label,
      sizeLabel: selectedSize ?? undefined,
      productName: product.productName,
      productImage: activeImage || product.productImage[0],
      price: product.price,
      discountedPrice: product.discountedPrice,
      finalPrice: product.finalPrice,
    });
    setQuantity(1);
    toast.success("Added to cart");
  };

  // All images: product images + variant images for the thumbnail strip
  const allThumbnails = [
    ...product.productImage,
    ...product.variants.map((v) => v.image).filter(Boolean),
  ];

  const breadcrumbs = [
    { name: product.categoryName, id: product.categoryID },
    ...(product.subCategoryName && product.subCategoryID
      ? [{ name: product.subCategoryName, id: product.subCategoryID }]
      : []),
    ...(product.subSubCategoryName && product.subSubCategoryID
      ? [{ name: product.subSubCategoryName, id: product.subSubCategoryID }]
      : []),
  ];

  const discountPercent = product.discountedPrice > 0
    ? Math.round(((product.price - product.finalPrice) / product.price) * 100)
    : null;

  return (
    <div className="mt-6 space-y-14">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.id}>
            {i > 0 && <span className="text-gray-300 select-none">›</span>}
            <Link
              to={`/categories/${crumb.id}/${encodeURIComponent(crumb.name)}`}
              className={`capitalize transition-colors ${
                i === breadcrumbs.length - 1
                  ? "text-gray-800 font-medium"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {crumb.name.trim()}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      {/* Main product layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-start">

        {/* Image gallery */}
        <div className="flex flex-col gap-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-[#F6F6F4]">
            <img
              src={activeImage}
              alt={product.productName}
              className="w-full h-full object-cover"
            />
          </div>
          {allThumbnails.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {allThumbnails.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-[72px] h-[72px] rounded-xl overflow-hidden transition-all ${
                    activeImage === img
                      ? "ring-2 ring-gray-900 ring-offset-2"
                      : "ring-1 ring-gray-200 hover:ring-gray-400 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">

          {/* Category label */}
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
            Category:{" "}
            <Link
              to={`/categories/${product.categoryID}/${encodeURIComponent(product.categoryName)}`}
              className="tracking-normal font-medium text-gray-600 hover:text-gray-900 capitalize transition-colors"
            >
              {product.categoryName.trim()}
              {product.subCategoryName && ` › ${product.subCategoryName}`}
              {product.subSubCategoryName && ` › ${product.subSubCategoryName}`}
            </Link>
          </p>

          {/* Name */}
          <h1 className="text-4xl font-bold text-gray-950 leading-tight tracking-tight">
            {product.productName}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 flex-wrap">
            {product.discountedPrice > 0 && (
              <span className="text-lg text-gray-400 line-through font-normal tabular-nums">
                {product.price.toLocaleString()} BDT
              </span>
            )}
            <span className="text-3xl font-bold text-gray-950 tabular-nums leading-none">
              {product.finalPrice.toLocaleString()} BDT
            </span>
            {discountPercent && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full tracking-wide">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-500 leading-relaxed text-[15px] whitespace-pre-wrap">
            {product.description}
          </p>

          <hr className="border-gray-100" />

          {/* Color variants */}
          {product.hasVariants && product.variants.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-sm font-semibold text-gray-800">
                Color
                {selectedVariant && (
                  <span className="ml-2 font-normal text-gray-400 capitalize">— {selectedVariant.label}</span>
                )}
              </p>
              <div className="flex gap-2.5 flex-wrap">
                {product.variants.map((variant) => (
                  <button
                    key={variant.label}
                    title={variant.label}
                    onClick={() => handleVariantSelect(variant)}
                    className={`w-14 h-14 rounded-xl overflow-hidden transition-all ${
                      selectedVariant?.label === variant.label
                        ? "ring-2 ring-gray-900 ring-offset-2 scale-105"
                        : "ring-1 ring-gray-200 hover:ring-gray-500 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img src={variant.image} alt={variant.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {selectedVariant?.hasSizes && selectedVariant.sizes.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-sm font-semibold text-gray-800">
                Size
                {selectedSize && <span className="ml-2 font-normal text-gray-400">— {selectedSize}</span>}
              </p>
              <div className="flex gap-2 flex-wrap">
                {selectedVariant.sizes.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSize(size.label)}
                    disabled={!size.inStock}
                    className={`min-w-[3rem] px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      selectedSize === size.label
                        ? "bg-gray-900 text-white border-gray-900"
                        : !size.inStock
                        ? "border-gray-200 text-gray-300 cursor-not-allowed line-through bg-gray-50"
                        : "border-gray-200 text-gray-700 hover:border-gray-800 hover:text-gray-900 bg-white"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Out of stock notice for non-variant products */}
          {!product.hasVariants && !product.inStock && (
            <p className="text-sm font-medium text-red-500">This product is currently out of stock</p>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-stretch gap-3 pt-1">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <button
                onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                className="w-11 flex items-center justify-center py-3 text-xl text-gray-500 hover:bg-gray-100 transition"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center text-base font-semibold text-gray-900 select-none">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-11 flex items-center justify-center py-3 text-xl text-gray-500 hover:bg-gray-100 transition"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              disabled={!canAdd}
              onClick={addToCart}
              className="flex-1 bg-gray-950 text-white py-3 px-6 rounded-xl font-semibold text-base hover:bg-gray-800 active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {getButtonLabel()}
            </button>
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="pt-10 border-t border-gray-100">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-xl font-bold text-gray-900">
            More from <span className="capitalize">{product.categoryName.trim()}</span>
          </h2>
          <Link
            to={`/categories/${product.categoryID}/${encodeURIComponent(product.categoryName)}`}
            className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors"
          >
            View all →
          </Link>
        </div>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <Card
                key={p._id}
                productID={p._id}
                name={p.productName}
                price={p.price}
                inStock={p.inStock}
                imageUrl={p.productImage[0] || ""}
                discountedPrice={p.discountedPrice}
                finalPrice={p.finalPrice}
                hasVariants={p.hasVariants}
                variants={p.variants}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No other products in this category yet.</p>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
