import React, { useEffect, useState } from "react";
import type { ProductProps } from "~/interface/ProductProps";
import useCountCartItems from "~/store/cart/countCartItems";
import axiosInstance from "~/utilities/axiosInstance";
import ErrorPage from "../notFoundPage/ErrorPage";

function ProductDetails({ id }: { id: string }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCountCartItems();
  const [product, setProduct] = useState<ProductProps>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data || []);
      } catch (err) {
        setError("Failed to load popular products.");
        console.error("Popular API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  const decreaseQty = () => {
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  };

  const increaseQty = () => {
    setQuantity((q) => q + 1);
  };

  console.log(product);

  if (loading) return;
  if (!product) return <ErrorPage />;

  const addToCart = () => {
    addItem({
      productID: id,
      name: product?.productName,
      price: product.finalPrice,
      imageUrl: product.productImage,
      quantity,
    });
    setQuantity(1);
    alert("Added to cart");
  };

  return (
    <div className="md:p-6 bg-white rounded-lg md:shadow-md mt-5">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image */}
        <div className="md:w-1/2">
          <img
            src={product.productImage}
            alt={product?.productName}
            className="rounded-lg w-full "
          />
        </div>

        {/* Details */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product?.productName}</h1>
            <p className=" mb-4">
              {product.discountedPrice && (
                <span className=" line-through text-gray-600">
                  {" "}
                  {product?.price} BDT
                </span>
              )}
              <span className="text-xl text-green-600 font-semibold">
                {" "}
                {product?.finalPrice} BDT
              </span>
            </p>

            {/* Rating */}
            {/*  <div className="flex items-center mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} filled={i <= Math.floor(product.rating)} />
              ))}
              <span className="ml-3 text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div> */}

            {/* Description */}
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              Description: <br />
              {product?.description}
            </p>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="mt-8 flex items-center gap-6">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={decreaseQty}
                className="px-4 py-2 text-xl font-bold text-gray-700 hover:bg-gray-100 transition"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="text"
                readOnly
                value={quantity}
                className="w-12 text-center text-lg font-semibold border-l border-r border-gray-300 outline-none cursor-pointer"
              />
              <button
                onClick={increaseQty}
                className="px-4 py-2 text-xl font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="bg-gray-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition cursor-pointer"
              onClick={addToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {/*  <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet.</p>
        ) : (
          <ul className="space-y-6">
            {product.reviews.map((review) => (
              <li
                key={review.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} filled={i <= review.rating} />
                  ))}
                  <span className="ml-3 font-semibold text-gray-800">
                    {review.name}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </div> */}
    </div>
  );
}

export default ProductDetails;
