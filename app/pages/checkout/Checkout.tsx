import React, { useState } from "react";
import useCountCartItems, { type CartItem } from "~/store/cart/countCartItems";

function Checkout() {
  const { cartList } = useCountCartItems();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = () => {
    alert(`Order placed! Thank you, ${userInfo.name}`);
  };

  const total = cartList.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className=" lg:p-6 lg:bg-gray-50 lg:mt-5">
      <h1 className="text-2xl font-semibold mb-8 text-center">Checkout</h1>

      <div className="flex flex-col md:flex-row gap-10 flex-grow  mx-auto w-full">
        {/* Products List */}
        <section className="md:w-1/2 bg-white rounded-md lg:shadow lg:p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Your Products</h2>
          {cartList.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <ul className="divide-y divide-gray-200 flex-grow overflow-y-auto">
              {cartList.map((item) => (
                <li
                  key={item.productID}
                  className="flex items-center py-4 lg:p-4 last:border-none"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded mr-4 flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-gray-600 text-sm">
                      Quantity: {item.quantity} × BDT {item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    BDT {(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
              <li className="flex justify-between py-4 lg:p-4 font-semibold text-lg">
                <span>Total</span>
                <span>BDT {total.toFixed(2)}</span>
              </li>
            </ul>
          )}
        </section>

        {/* User Info Form */}
        {/*  <section className="md:w-1/2 bg-white rounded-md lg:shadow lg:p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePlaceOrder();
            }}
            className="space-y-6 flex-grow flex flex-col justify-between"
          >
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={userInfo.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={userInfo.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Contact number
              </label>
              <input
                id="phone"
                name="phone"
                type="number"
                value={userInfo.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label htmlFor="address" className="block mb-1 font-medium">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={4}
                value={userInfo.address}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded text-sm font-semibold hover:bg-gray-900 transition mt-4 cursor-pointer"
            >
              Place Order
            </button>
          </form>
        </section> */}
        <div className=" flex items-center mx-auto">
          <div className="text-center space-y-6">
            <p>To place an order, please inbox us on Facebook</p>
            <a
              href="https://www.facebook.com/radianceAva"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition"
            >
              Click to Inbox Us on Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
