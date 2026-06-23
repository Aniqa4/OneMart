import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useCountCartItems from "~/store/cart/countCartItems";
import useAuthStore from "~/store/auth/useAuthStore";
import useOrderStore from "~/store/orders/useOrderStore";
import type { CheckoutForm } from "./interface/checkout.types";
import { DELIVERY_OPTIONS } from "./interface/checkout.types";
import OrderSummary from "./components/OrderSummary";
import DeliveryForm from "./components/DeliveryForm";
import OrderSuccessScreen from "./components/OrderSuccessScreen";
import CancelCheckoutModal from "./components/CancelCheckoutModal";

const EMPTY_FORM: CheckoutForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
  deliveryLocation: "",
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cartList, clearCart } = useCountCartItems();
  const { user } = useAuthStore();
  const { placeOrder, placing } = useOrderStore();

  const [form, setForm] = useState<CheckoutForm>(EMPTY_FORM);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);
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

  const selectedDelivery = DELIVERY_OPTIONS.find((o) => o.value === form.deliveryLocation) ?? null;
  const subtotal = cartList.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = selectedDelivery ? subtotal + selectedDelivery.charge : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartList.length === 0) { toast.error("Your cart is empty"); return; }
    if (!form.deliveryLocation) { toast.error("Please select your delivery location"); return; }

    try {
      const order = await placeOrder({
        items: cartList.map((item) => ({
          productId: item.productID,
          quantity: item.quantity,
          variantLabel: item.variantLabel,
          sizeLabel: item.sizeLabel,
        })),
        customer: {
          name: form.name,
          email: form.email,
          address: form.address,
          phone: form.phone,
        },
        paymentMethod: "Cash on Delivery",
        deliveryCharge: selectedDelivery!.charge,
        notes: form.notes || undefined,
      });
      clearCart();
      setOrderSuccessId(order._id);
    } catch (err: any) {
      toast.error(err.message || "Could not place order. Please try again.");
    }
  };

  const handleCancelClick = () => {
    if (cartList.length === 0) { navigate("/"); return; }
    setShowCancelConfirm(true);
  };

  if (orderSuccessId) return <OrderSuccessScreen orderId={orderSuccessId} />;

  return (
    <div className="lg:p-6 lg:bg-gray-50 lg:mt-5 pb-10">
      <h1 className="text-2xl font-semibold mb-8 text-center">Checkout</h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto w-full">
        <OrderSummary cartList={cartList} deliveryLocation={form.deliveryLocation} />
        <DeliveryForm
          form={form}
          placing={placing}
          total={total}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancelClick}
        />
      </div>

      {showCancelConfirm && (
        <CancelCheckoutModal
          onConfirm={() => { setShowCancelConfirm(false); navigate(-1); }}
          onClose={() => setShowCancelConfirm(false)}
        />
      )}
    </div>
  );
}
