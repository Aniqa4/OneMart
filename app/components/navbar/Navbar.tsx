import { useEffect } from "react";
import { IoBagHandleSharp } from "react-icons/io5";
import { Link } from "react-router";
import useCountCartItems from "~/store/cart/countCartItems";
import useManageCart from "~/store/cart/manageCart";
import Cart from "./Cart";

function Navbar() {
  const { toggleCart } = useManageCart();
  const { cartItems, initializeFromLocalStorage } = useCountCartItems();

  useEffect(() => {
    initializeFromLocalStorage();
  }, []);

  return (
    <div className="border-b border-gray-200 py-3 brand-bg text-white">
      <div className="max-w-[1280px] px-5 lg:px-10 mx-auto flex items-center justify-between">
        <p className="font-extrabold text-3xl">
          <Link to={"/"}>eCommerce</Link>
        </p>

        <div className="flex gap-10 items-center">
          <div onClick={toggleCart} className="relative cursor-pointer">
            <IoBagHandleSharp size={24} />
            {cartItems > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] text-[12px] font-semibold bg-red-600 text-white rounded-full flex items-center justify-center px-[5px]">
                {cartItems}
              </span>
            )}
          </div>
          <Link to={"/login"}>
            <p>Login/Register</p>
          </Link>
        </div>
      </div>

      {/* -------------cart sidebar--------- */}
      <Cart />
    </div>
  );
}

export default Navbar;
