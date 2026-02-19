import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate } from "react-router";
import useCountCartItems, { type CartItem } from "~/store/cart/countCartItems";
import useManageCart from "~/store/cart/manageCart";

function Cart() {
  const { isOpen, closeCart } = useManageCart();
  const { cartList, removeItem, addItem } = useCountCartItems();
  const navigate = useNavigate();

  const handleIncrease = (item: CartItem) => {
    addItem({ ...item, quantity: 1 });
  };

  const handleDecrease = (item: CartItem) => {
    removeItem(item.productID, 1);
  };

  const handleRemove = (item: CartItem) => {
    removeItem(item.productID, item.quantity);
  };

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <div>
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-black bg-opacity-20 transition-opacity duration-300 ${
          isOpen ? "opacity-30 visible" : "opacity-0 invisible"
        } cursor-pointer`}
      />

      {/* Cart drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-gray-600 hover:text-gray-900 transition cursor-pointer"
          >
            <RxCross1 size={24} />
          </button>
        </header>

        {/* Cart items or empty */}
        <main className="flex-1 overflow-y-auto p-5">
          {cartList.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              Your cart is empty.
            </p>
          ) : (
            <ul className="space-y-6">
              {cartList.map((item) => (
                <li
                  key={item.productID}
                  className="flex items-center justify-between"
                >
                  {/* Image */}
                  <Link to={`/details/${item.productID}`} onClick={closeCart}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded object-cover flex-shrink-0"
                    />
                  </Link>

                  {/* Info + qty */}
                  <div className="flex flex-col flex-grow ml-4">
                    <p className="text-gray-900 text-sm font-medium truncate">
                      <Link
                        to={`/details/${item.productID}`}
                        onClick={closeCart}
                      >
                        {item.name}
                      </Link>
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      BDT {item.price.toFixed(2)} each
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center mt-2 space-x-3">
                      <button
                        onClick={() => handleDecrease(item)}
                        className="w-7 h-7 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        –
                      </button>
                      <span className="text-gray-900 text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrease(item)}
                        className="w-7 h-7 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item)}
                    className="ml-4 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </main>

        {/* Footer */}
        {cartList.length > 0 && (
          <footer className="border-t border-gray-200 p-5">
            <div className="flex justify-between text-gray-900 font-semibold text-base mb-4">
              <span>Total</span>
              <span>
                BDT{" "}
                {cartList
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded text-sm font-semibold tracking-wide hover:bg-gray-900 transition cursor-pointer"
            >
              Checkout
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}

export default Cart;
