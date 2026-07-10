import type { CheckoutForm } from "../interface/checkout.types";
import { DELIVERY_OPTIONS } from "../interface/checkout.types";

interface CartItem {
  _id: string;
  productId: string;
  productName: string;
  productImage: string;
  finalPrice: number;
  quantity: number;
}

interface Props {
  cartList: CartItem[];
  deliveryLocation: CheckoutForm["deliveryLocation"];
}

export default function OrderSummary({ cartList, deliveryLocation }: Props) {
  const subtotal = cartList.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
  const selectedDelivery = DELIVERY_OPTIONS.find((o) => o.value === deliveryLocation) ?? null;
  const deliveryCharge = selectedDelivery?.charge ?? null;
  const total = deliveryCharge !== null ? subtotal + deliveryCharge : null;

  return (
    <section className="md:w-1/2 bg-white rounded-xl lg:shadow lg:p-6 flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Order Summary</h2>

      {cartList.length === 0 ? (
        <p className="text-gray-400 italic py-8 text-center">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-100 flex-grow">
            {cartList.map((item) => (
              <li key={item._id} className="flex items-center gap-4 py-3 px-1">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-14 h-14 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{item.productName}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Qty {item.quantity} × BDT {item.finalPrice?.toFixed(2)}
                  </p>
                </div>
                <p className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                  BDT {(item.finalPrice * item.quantity)?.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>BDT {subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery Charge</span>
              {deliveryCharge !== null ? (
                <span>BDT {deliveryCharge?.toFixed(2)}</span>
              ) : (
                <span className="text-gray-400 italic">Select location</span>
              )}
            </div>
            <div className="flex justify-between text-base font-semibold text-gray-900 border-t border-gray-100 pt-2">
              <span>Total</span>
              {total !== null ? (
                <span>BDT {total?.toFixed(2)}</span>
              ) : (
                <span className="text-gray-400 italic">—</span>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
