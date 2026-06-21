import type { Order, Pagination } from "~/store/orders/useOrderStore";
import { STATUS_STYLES } from "../interface/dashboard.types";

interface Props {
  orders: Order[];
  pagination: Pagination | null;
  loading: boolean;
  cancellingId: string | null;
  onSelectOrder: (order: Order) => void;
  onCancelClick: (orderId: string) => void;
  onPageChange: (page: number) => void;
}

export default function OrdersSection({
  orders,
  pagination,
  loading,
  cancellingId,
  onSelectOrder,
  onCancelClick,
  onPageChange,
}: Props) {
  const pageNumbers = pagination
    ? Array.from({ length: pagination.pages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === pagination.pages || Math.abs(p - pagination.page) <= 1)
        .reduce<(number | "…")[]>((acc, p, idx, arr) => {
          if (idx > 0 && typeof arr[idx - 1] === "number" && (p as number) - (arr[idx - 1] as number) > 1) {
            acc.push("…");
          }
          acc.push(p);
          return acc;
        }, [])
    : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900">My Orders</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {pagination
            ? `${pagination.total} order${pagination.total !== 1 ? "s" : ""} total`
            : "Your order history"}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-300">
          <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <svg className="w-14 h-14 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm">No orders yet</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto -mx-6 lg:-mx-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Order ID", "Date", "Status", "Total", ""].map((h) => (
                    <th
                      key={h}
                      className={`pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${
                        h === "Total" ? "text-right px-4" : h === "" ? "px-6 lg:px-8" : "text-left px-4 first:px-6 first:lg:px-8"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => onSelectOrder(order)}
                    className="hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="px-6 lg:px-8 py-4 font-mono text-xs text-gray-500">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[order.orderStatus] ?? "bg-gray-100 text-gray-600"}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-gray-900 whitespace-nowrap">
                      BDT {order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 lg:px-8 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {order.orderStatus === "pending" && (
                        <button
                          onClick={() => onCancelClick(order._id)}
                          disabled={cancellingId === order._id}
                          className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50 transition"
                        >
                          {cancellingId === order._id ? "Cancelling…" : "Cancel"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1 || loading}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {pageNumbers.map((p, idx) =>
                  p === "…" ? (
                    <span key={`e-${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => onPageChange(p as number)}
                      disabled={loading}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                        pagination.page === p
                          ? "bg-gray-900 text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages || loading}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
