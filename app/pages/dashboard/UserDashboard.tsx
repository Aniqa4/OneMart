import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useAuthStore from "~/store/auth/useAuthStore";
import useOrderStore from "~/store/orders/useOrderStore";

function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":   return "bg-green-100 text-green-800";
    case "processing":  return "bg-yellow-100 text-yellow-800";
    case "shipped":     return "bg-blue-100 text-blue-800";
    case "cancelled":   return "bg-red-100 text-red-800";
    default:            return "bg-gray-100 text-gray-800";
  }
}

export default function UserDashboard() {
  const { user, updateProfile, changePassword, resendVerification, fetchProfile } = useAuthStore();
  const { orders, loading: ordersLoading, fetchUserOrders, cancelOrder } = useOrderStore();

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  // Edit profile state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", address: "" });
  const [profileLoading, setProfileLoading] = useState(false);

  // Change password state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });

  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name, phone: user.phone || "", address: user.address || "" });
      fetchUserOrders(user.id);
    }
  }, [user?.id]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateProfile(profileForm);
      toast.success("Profile updated");
      setIsEditProfileOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwLoading(true);
    try {
      await changePassword(pwForm.currentPassword, pwForm.newPassword, pwForm.confirmNewPassword);
      toast.success("Password changed. Please sign in again.");
      setPwForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      setIsChangePasswordOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setPwLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      await resendVerification();
      toast.success("Verification email sent! Check your inbox.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend email");
    } finally {
      setResendLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelTargetId) return;
    setCancellingId(cancelTargetId);
    setCancelTargetId(null);
    try {
      await cancelOrder(cancelTargetId);
      if (selectedOrder?._id === cancelTargetId) {
        setSelectedOrder((o: any) => ({ ...o, orderStatus: "cancelled" }));
      }
      toast.success("Order cancelled successfully.");
    } catch (err: any) {
      toast.error(err.message || "Could not cancel order.");
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return <div className="text-center py-20 text-gray-500">Loading…</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-12 md:px-6 space-y-10">

      {/* Email verification banner */}
      {!user.isEmailVerified && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-5 py-4 flex items-center justify-between gap-4">
          <p className="text-sm text-yellow-800">
            Your email is not verified. Check your inbox or resend the verification email.
          </p>
          <button
            onClick={handleResendVerification}
            disabled={resendLoading}
            className="text-sm text-yellow-900 font-semibold underline whitespace-nowrap disabled:opacity-50"
          >
            {resendLoading ? "Sending…" : "Resend email"}
          </button>
        </div>
      )}

      {/* User Info Card */}
      <section className="bg-white rounded-xl md:border border-gray-100 md:shadow-md md:p-8">
        <div className="flex justify-between gap-5 items-center mb-6">
          <h2 className="text-2xl font-semibold border-b border-gray-200 pb-3 text-gray-800 flex-1">
            User Information
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="text-sm text-gray-600 hover:underline cursor-pointer"
            >
              Edit Profile
            </button>
            {user.authProvider !== "google" && (
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="text-sm text-gray-600 hover:underline cursor-pointer"
              >
                Change Password
              </button>
            )}
          </div>
        </div>

        {user.profilePicture && (
          <img src={user.profilePicture} alt={user.name} className="w-16 h-16 rounded-full mb-4 object-cover" />
        )}

        <p className="mb-3 text-gray-700"><span className="font-semibold text-gray-900">Name:</span> {user.name}</p>
        <p className="mb-3 text-gray-700"><span className="font-semibold text-gray-900">Email:</span> {user.email}</p>
        <p className="mb-3 text-gray-700"><span className="font-semibold text-gray-900">Phone:</span> {user.phone || "—"}</p>
        <p className="mb-3 text-gray-700"><span className="font-semibold text-gray-900">Address:</span> {user.address || "—"}</p>
        <p className="text-gray-700">
          <span className="font-semibold text-gray-900">Email verified:</span>{" "}
          <span className={user.isEmailVerified ? "text-green-600" : "text-yellow-600"}>
            {user.isEmailVerified ? "Yes" : "No"}
          </span>
        </p>
      </section>

      {/* Orders */}
      <section className="md:border border-gray-100 rounded-xl md:shadow-md md:p-8 overflow-x-auto">
        <h2 className="text-2xl font-semibold border-b border-gray-200 pb-3 mb-8 text-gray-800">
          My Orders
        </h2>

        {ordersLoading ? (
          <p className="text-gray-400 text-center py-10">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-center py-20 italic">No orders found.</p>
        ) : (
          <table className="w-full table-auto border-collapse text-gray-700">
            <thead>
              <tr className="text-left border-b border-gray-300 uppercase text-sm tracking-wide">
                <th className="py-3 lg:px-5">Order ID</th>
                <th className="py-3 lg:px-5">Date</th>
                <th className="py-3 lg:px-5">Status</th>
                <th className="py-3 lg:px-5">Total</th>
                <th className="py-3 lg:px-5"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="py-4 lg:px-5 font-medium text-xs">{order._id}</td>
                  <td className="py-4 lg:px-5 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 lg:px-5">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-4 lg:px-5 font-semibold whitespace-nowrap">BDT {order.totalAmount?.toFixed(2)}</td>
                  <td className="py-4 lg:px-5" onClick={(e) => e.stopPropagation()}>
                    {["pending", "processing"].includes(order.orderStatus) && (
                      <button
                        onClick={() => setCancelTargetId(order._id)}
                        disabled={cancellingId === order._id}
                        className="text-xs text-red-600 hover:underline disabled:opacity-50"
                      >
                        {cancellingId === order._id ? "Cancelling…" : "Cancel"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setIsEditProfileOpen(false)}>
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={profileForm.address}
                  onChange={(e) => setProfileForm((p) => ({ ...p, address: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="submit" disabled={profileLoading} className="bg-gray-800 text-white px-5 py-2 rounded-md text-sm hover:bg-gray-900 disabled:opacity-60">
                  {profileLoading ? "Saving…" : "Save"}
                </button>
                <button type="button" onClick={() => setIsEditProfileOpen(false)} className="px-5 py-2 rounded-md border text-sm hover:bg-gray-100">
                  Cancel
                </button>
              </div>
            </form>
            <button onClick={() => setIsEditProfileOpen(false)} className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setIsChangePasswordOpen(false)}>
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {(["currentPassword", "newPassword", "confirmNewPassword"] as const).map((field, i) => (
                <div key={field} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {["Current Password", "New Password", "Confirm New Password"][i]}
                  </label>
                  <input
                    type={showPw[["current", "next", "confirm"][i] as keyof typeof showPw] ? "text" : "password"}
                    value={pwForm[field]}
                    onChange={(e) => setPwForm((p) => ({ ...p, [field]: e.target.value }))}
                    className="w-full border rounded-md px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => ({ ...p, [["current", "next", "confirm"][i]]: !p[["current", "next", "confirm"][i] as keyof typeof p] }))}
                    className="absolute right-3 bottom-2.5 text-gray-400 text-sm"
                  >
                    {showPw[["current", "next", "confirm"][i] as keyof typeof showPw] ? "Hide" : "Show"}
                  </button>
                </div>
              ))}
              <p className="text-xs text-gray-400">Min. 8 characters with one uppercase letter and one number.</p>
              <div className="flex gap-3 justify-end">
                <button type="submit" disabled={pwLoading} className="bg-gray-800 text-white px-5 py-2 rounded-md text-sm hover:bg-gray-900 disabled:opacity-60">
                  {pwLoading ? "Saving…" : "Change Password"}
                </button>
                <button type="button" onClick={() => setIsChangePasswordOpen(false)} className="px-5 py-2 rounded-md border text-sm hover:bg-gray-100">
                  Cancel
                </button>
              </div>
            </form>
            <button onClick={() => setIsChangePasswordOpen(false)} className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4">Order Details</h3>
            <p className="text-xs text-gray-400 font-mono mb-3 break-all">{selectedOrder._id}</p>

            <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700 mb-4">
              <span className="font-medium text-gray-900">Date</span>
              <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              <span className="font-medium text-gray-900">Status</span>
              <span>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor(selectedOrder.orderStatus)}`}>
                  {selectedOrder.orderStatus}
                </span>
              </span>
              <span className="font-medium text-gray-900">Payment</span>
              <span className="capitalize">{selectedOrder.paymentStatus}</span>
              {selectedOrder.paymentMethod && (
                <>
                  <span className="font-medium text-gray-900">Payment Method</span>
                  <span>{selectedOrder.paymentMethod}</span>
                </>
              )}
              <span className="font-medium text-gray-900">Subtotal</span>
              <span>BDT {selectedOrder.subtotal?.toFixed(2)}</span>
              <span className="font-medium text-gray-900">Delivery Charge</span>
              <span>BDT {selectedOrder.deliveryCharge?.toFixed(2)}</span>
              <span className="font-medium text-gray-900">Total</span>
              <span className="font-semibold">BDT {selectedOrder.totalAmount?.toFixed(2)}</span>
            </div>

            {selectedOrder.customer && (
              <div className="text-sm text-gray-700 mb-4 border-t pt-3">
                <p className="font-medium text-gray-900 mb-1">Delivery To</p>
                <p>{selectedOrder.customer.name}</p>
                {selectedOrder.customer.phone && <p>{selectedOrder.customer.phone}</p>}
                {selectedOrder.customer.address && <p className="text-gray-500">{selectedOrder.customer.address}</p>}
              </div>
            )}

            <div className="border-t pt-3">
              <p className="font-medium text-gray-900 mb-2 text-sm">Items</p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                {selectedOrder.items?.map((item: any, idx: number) => (
                  <li key={idx} className="flex justify-between">
                    <span>{item.productName} × {item.quantity}</span>
                    <span className="font-medium">BDT {item.finalPrice?.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedOrder.notes && (
              <p className="text-sm text-gray-500 mt-3 border-t pt-3">
                <span className="font-medium text-gray-700">Notes:</span> {selectedOrder.notes}
              </p>
            )}

            {["pending", "processing"].includes(selectedOrder.orderStatus) && (
              <div className="mt-5 pt-4 border-t">
                <p className="text-xs text-gray-500 mb-3">
                  {selectedOrder.orderStatus === "pending"
                    ? "Order hasn't been processed yet — you can still cancel it."
                    : "Order is being processed — you can still request a cancellation."}
                </p>
                <button
                  onClick={() => {
                    setCancelTargetId(selectedOrder._id);
                    setSelectedOrder(null);
                  }}
                  disabled={cancellingId === selectedOrder._id}
                  className="w-full py-2.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
                >
                  Cancel This Order
                </button>
              </div>
            )}

            <button onClick={() => setSelectedOrder(null)} className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl">&times;</button>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation */}
      {cancelTargetId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setCancelTargetId(null)}>
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Cancel Order?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. The order will be marked as cancelled and stock will be restored.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setCancelTargetId(null)} className="px-5 py-2 rounded-lg border text-sm hover:bg-gray-50 transition">
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={!!cancellingId}
                className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
