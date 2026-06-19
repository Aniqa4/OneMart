import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useCountCartItems from "~/store/cart/countCartItems";
import useAuthStore from "~/store/auth/useAuthStore";
import useOrderStore from "~/store/orders/useOrderStore";

const DELIVERY_OPTIONS = [
  { value: "inside", label: "Inside Dhaka", charge: 70 },
  { value: "outside", label: "Outside Dhaka", charge: 120 },
] as const;

type DeliveryLocation = "inside" | "outside" | "";

function Checkout() {
  const navigate = useNavigate();
  const { cartList, clearCart } = useCountCartItems();
  const { user } = useAuthStore();
  const { placeOrder, placing } = useOrderStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    deliveryLocation: "" as DeliveryLocation,
  });

  const [orderSuccess, setOrderSuccess] = useState<{ id: string } | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name || f.name,
        email: user.email || f.email,
        phone: user.phone || f.phone,
        address: user.address || f.address,
      }));
    }
  }, [user?.id]);

  const subtotal = cartList.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedDelivery = DELIVERY_OPTIONS.find((o) => o.value === form.deliveryLocation) ?? null;
  const deliveryCharge = selectedDelivery?.charge ?? null;
  const total = deliveryCharge !== null ? subtotal + deliveryCharge : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartList.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!form.deliveryLocation) {
      toast.error("Please select your delivery location");
      return;
    }

    try {
      const order = await placeOrder({
        items: cartList.map((item) => ({ productId: item.productID, quantity: item.quantity })),
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          address: form.address || undefined,
        },
        paymentMethod: "Cash on Delivery",
        notes: form.notes || undefined,
        deliveryCharge: deliveryCharge!,
      });

      clearCart();
      setOrderSuccess({ id: order._id });
    } catch (err: any) {
      toast.error(err.message || "Could not place order. Please try again.");
    }
  };

  const handleCancelOrder = () => {
    if (cartList.length === 0) {
      navigate("/");
      return;
    }
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    navigate(-1);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-10 max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Order Placed!</h2>
          <p className="text-gray-500 text-sm">
            Thank you for your purchase. We'll process your order shortly.
          </p>
          <p className="text-xs text-gray-400 font-mono break-all">Order ID: {orderSuccess.id}</p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate("/")}
              className="border border-gray-300 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:p-6 lg:bg-gray-50 lg:mt-5 pb-10">
      <h1 className="text-2xl font-semibold mb-8 text-center">Checkout</h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto w-full">
        {/* Order Summary */}
        <section className="md:w-1/2 bg-white rounded-xl lg:shadow lg:p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Order Summary</h2>

          {cartList.length === 0 ? (
            <p className="text-gray-400 italic py-8 text-center">Your cart is empty.</p>
          ) : (
            <>
              <ul className="divide-y divide-gray-100 flex-grow">
                {cartList.map((item) => (
                  <li key={item.productID} className="flex items-center gap-4 py-3 px-1">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Qty {item.quantity} × BDT {item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                      BDT {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>BDT {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Charge</span>
                  {deliveryCharge !== null ? (
                    <span>BDT {deliveryCharge.toFixed(2)}</span>
                  ) : (
                    <span className="text-gray-400 italic">Select location</span>
                  )}
                </div>
                <div className="flex justify-between text-base font-semibold text-gray-900 border-t border-gray-100 pt-2">
                  <span>Total</span>
                  {total !== null ? (
                    <span>BDT {total.toFixed(2)}</span>
                  ) : (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </div>
              </div>
            </>
          )}
        </section>

        {/* Delivery & Payment Form */}
        <section className="md:w-1/2 bg-white rounded-xl lg:shadow lg:p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Delivery Details</h2>

          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+880..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Street, City, District, Postal Code"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Location <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                {DELIVERY_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex-1 flex items-center justify-between border rounded-lg px-3 py-2.5 cursor-pointer text-sm transition ${
                      form.deliveryLocation === opt.value
                        ? "border-black bg-gray-50 font-medium"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deliveryLocation"
                        value={opt.value}
                        checked={form.deliveryLocation === opt.value}
                        onChange={handleChange}
                        className="accent-black"
                      />
                      {opt.label}
                    </span>
                    <span className="text-gray-500">৳{opt.charge}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <div className="flex items-center gap-2 border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-700">
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2M5 9h14l1 11H4L5 9z" />
                </svg>
                Cash on Delivery
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (optional)</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Special instructions, colour preferences, etc."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="flex gap-3 mt-auto pt-4">
              <button
                type="submit"
                disabled={placing || cartList.length === 0}
                className="flex-1 bg-black text-white py-3 rounded-lg text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placing
                  ? "Placing Order…"
                  : total !== null
                  ? `Place Order · BDT ${total.toFixed(2)}`
                  : "Place Order"}
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                className="px-5 py-3 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowCancelConfirm(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Cancel Checkout?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Your cart items will be saved. Are you sure you want to go back?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-5 py-2 rounded-lg border text-sm hover:bg-gray-50 transition"
              >
                Keep Checking Out
              </button>
              <button
                onClick={confirmCancel}
                className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition"
              >
                Yes, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
