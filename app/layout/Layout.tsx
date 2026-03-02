import React, { useEffect, type ReactNode } from "react";
import { GiShoppingCart } from "react-icons/gi";
import Footer from "~/components/Footer";
import Navbar from "~/components/navbar/Navbar";
import SubNavbar from "~/components/navbar/SubNavbar";
import useCountCartItems from "~/store/cart/countCartItems";
import useManageCart from "~/store/cart/manageCart";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { openCart } = useManageCart();
  const { cartItems, initializeFromLocalStorage } = useCountCartItems();

  useEffect(() => {
    initializeFromLocalStorage();
  }, []);

  return (
    <div>
      {/* Floating Cart Button */}
      <div
        onClick={openCart}
        className="fixed z-50 right-5 bottom-10 lg:right-16 lg:bottom-16 bg-white hover:bg-gray-100 cursor-pointer  
          w-16 h-16 flex justify-center items-center rounded-full"
        style={{ boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)" }}
      >
        <GiShoppingCart size={25} />
        {cartItems > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {cartItems}
          </span>
        )}
      </div>

      {/* Fixed Navbar + SubNavbar */}
      <div className="fixed top-0 left-0 w-full z-40 bg-white shadow-sm">
        <Navbar />
        <SubNavbar />
      </div>

      {/* Page Content with top padding so it’s not hidden behind navbar */}
      <div className="pt-[112px] max-w-[1280px] px-5 lg:px-10 mx-auto mb-10 lg:mb-20">
        {children}
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
