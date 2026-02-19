import { useState } from "react";
import { Link } from "react-router";
import useCountCartItems from "~/store/cart/countCartItems";

interface CardProps {
  productID: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  discountedPrice: number | null;
  finalPrice: number;
}

function Card({
  productID,
  name,
  price,
  discountedPrice,
  finalPrice,
  imageUrl,
  quantity,
}: CardProps) {
  const [showText, setShowText] = useState(false);
  const { addItem } = useCountCartItems();

  const addToCart = () => {
    addItem({ productID, name, price, imageUrl, quantity: 1 });
  };

  const requestProduct = () => {
    alert(`Request sent for "${name}"`);
  };

  return (
    <Link to={`/details/${productID}`}>
      <div className="p-3 bg-gray-50 grid grid-cols-1 rounded-md shadow-sm">
        <div
          onMouseEnter={() => quantity > 0 && setShowText(true)}
          onMouseLeave={() => setShowText(false)}
          className="relative"
        >
          <img
            src={imageUrl}
            alt={name}
            className="aspect-square object-cover rounded"
          />
          {quantity === 0 ? (
            <div className="absolute inset-0 bg-black opacity-60 flex items-center justify-center text-white text-xl font-bold rounded">
              Sold Out
            </div>
          ) : (
            showText && (
              <div className="absolute inset-0  flex items-center justify-center text-lg font-semibold rounded transition-opacity duration-200">
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
              <span className=" line-through text-gray-600"> {price} BDT</span>
            )}{" "}
            {finalPrice} BDT
          </p>
        </div>

        {quantity > 0 ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart();
            }}
            className="w-full rounded py-1 font-medium cursor-pointer bg-gray-200 hover:bg-gray-300  uppercase"
          >
            Add to cart
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              requestProduct();
            }}
            className="w-full rounded py-1 font-medium bg-gray-600 text-white hover:bg-gray-700 cursor-pointer uppercase"
          >
            Add to Wishlist
          </button>
        )}
      </div>
    </Link>
  );
}

export default Card;
