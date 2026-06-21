import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { toast } from "react-toastify";
import useAuthStore from "~/store/auth/useAuthStore";
import useOrderStore from "~/store/orders/useOrderStore";
import type { Order } from "~/store/orders/useOrderStore";
import type { Section } from "./interface/dashboard.types";
import DashboardSidebar from "./components/DashboardSidebar";
import ProfileSection from "./components/ProfileSection";
import OrdersSection from "./components/OrdersSection";
import SecuritySection from "./components/SecuritySection";
import OrderDetailModal from "./components/OrderDetailModal";
import CancelConfirmModal from "./components/CancelConfirmModal";

export default function UserDashboard() {
  const { user, updateProfile, changePassword, resendVerification } = useAuthStore();
  const { orders, pagination, loading: ordersLoading, fetchUserOrders, cancelOrder } = useOrderStore();

  const location = useLocation();
  const [section, setSection] = useState<Section>(
    (location.state as { section?: Section })?.section ?? "profile"
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (user && section === "orders") {
      fetchUserOrders(user.id, pagination?.page ?? 1);
    }
  }, [section, user?.id]);

  const handlePageChange = (page: number) => {
    if (user) fetchUserOrders(user.id, page);
  };

  const handleCancelOrder = async () => {
    if (!cancelTargetId) return;
    setCancellingId(cancelTargetId);
    setCancelTargetId(null);
    try {
      await cancelOrder(cancelTargetId);
      if (selectedOrder?._id === cancelTargetId) {
        setSelectedOrder((o) => (o ? { ...o, orderStatus: "cancelled" } : null));
      }
      toast.success("Order cancelled.");
    } catch (err: any) {
      toast.error(err.message || "Could not cancel order.");
    } finally {
      setCancellingId(null);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      await resendVerification();
      toast.success("Verification email sent!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend email");
    } finally {
      setResendLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="w-10 h-10 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm">Loading your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] mt-6">
      {!user.isEmailVerified && (
        <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-amber-800">Your email address is not verified.</p>
          <button
            onClick={handleResendVerification}
            disabled={resendLoading}
            className="text-sm font-semibold text-amber-900 underline underline-offset-2 disabled:opacity-50"
          >
            {resendLoading ? "Sending…" : "Resend verification email"}
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <DashboardSidebar user={user} section={section} onSectionChange={setSection} />

        <main className="flex-1 min-w-0">
          {section === "profile" && (
            <ProfileSection user={user} updateProfile={updateProfile} />
          )}
          {section === "orders" && (
            <OrdersSection
              orders={orders}
              pagination={pagination}
              loading={ordersLoading}
              cancellingId={cancellingId}
              onSelectOrder={setSelectedOrder}
              onCancelClick={setCancelTargetId}
              onPageChange={handlePageChange}
            />
          )}
          {section === "security" && (
            <SecuritySection user={user} changePassword={changePassword} />
          )}
        </main>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          cancellingId={cancellingId}
          onClose={() => setSelectedOrder(null)}
          onCancel={(id) => { setCancelTargetId(id); setSelectedOrder(null); }}
        />
      )}

      {cancelTargetId && (
        <CancelConfirmModal
          cancellingId={cancellingId}
          onConfirm={handleCancelOrder}
          onClose={() => setCancelTargetId(null)}
        />
      )}
    </div>
  );
}
