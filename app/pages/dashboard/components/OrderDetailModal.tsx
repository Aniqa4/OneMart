import type { Order } from "~/store/orders/useOrderStore";
import { STATUS_STYLES } from "../interface/dashboard.types";

interface Props {
  order: Order;
  cancellingId: string | null;
  onClose: () => void;
  onCancel: (orderId: string) => void;
}

export default function OrderDetailModal({ order, cancellingId, onClose, onCancel }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-900">Order Details</h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">#{order._id.slice(-8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Date",
                value: new Date(order.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
              },
              {
                label: "Status",
                value: (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[order.orderStatus] ?? "bg-gray-100 text-gray-600"}`}>
                    {order.orderStatus}
                  </span>
                ),
              },
              { label: "Payment", value: <span className="capitalize">{order.paymentStatus}</span> },
              { label: "Method", value: order.paymentMethod || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <div className="text-sm font-medium text-gray-900">{value as any}</div>
              </div>
            ))}
          </div>

          {order.customer && (
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Delivery To</p>
              <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
              {order.customer.phone && <p className="text-sm text-gray-600 mt-0.5">{order.customer.phone}</p>}
              {order.customer.address && <p className="text-sm text-gray-500 mt-0.5">{order.customer.address}</p>}
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Items</p>
            <ul className="space-y-2">
              {order.items?.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    {item.productName} <span className="text-gray-400">× {item.quantity}</span>
                  </span>
                  <span className="font-medium text-gray-900">BDT {item.finalPrice?.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span><span>BDT {order.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Delivery</span><span>BDT {order.deliveryCharge?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-gray-900 border-t border-gray-100 pt-2">
              <span>Total</span><span>BDT {order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>

          {order.notes && (
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
              <span className="font-medium text-gray-700">Notes: </span>{order.notes}
            </div>
          )}

          {["pending", "processing"].includes(order.orderStatus) && (
            <button
              onClick={() => onCancel(order._id)}
              disabled={cancellingId === order._id}
              className="w-full py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
