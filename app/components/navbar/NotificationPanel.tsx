import { useState } from "react";
import { useNavigate } from "react-router";
import type { Notification } from "~/store/notifications/useNotificationStore";
import useNotificationStore from "~/store/notifications/useNotificationStore";

// ── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function actionMeta(actionType: string): { icon: React.ReactNode; accent: string } {
  const type = actionType?.split(":")[0];
  switch (type) {
    case "order":
      return {
        accent: "bg-blue-100 text-blue-600",
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
      };
    case "product":
      return {
        accent: "bg-violet-100 text-violet-600",
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
      };
    case "payment":
      return {
        accent: "bg-green-100 text-green-600",
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        ),
      };
    default:
      return {
        accent: "bg-gray-100 text-gray-500",
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
  }
}

function statusBadge(status?: string) {
  if (!status) return null;
  const colors: Record<string, string> = {
    delivered:  "bg-green-100 text-green-700",
    processing: "bg-yellow-100 text-yellow-700",
    shipped:    "bg-blue-100 text-blue-700",
    cancelled:  "bg-red-100 text-red-700",
    pending:    "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold capitalize ${colors[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function NotificationSkeleton() {
  return (
    <div className="px-4 py-3 flex gap-3 animate-pulse">
      <div className="w-8 h-8 rounded-xl bg-gray-100 shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-2.5 bg-gray-100 rounded w-1/4 mt-1" />
      </div>
    </div>
  );
}

function NotificationItem({
  n,
  confirming,
  onRead,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
  onNavigate,
}: {
  n: Notification;
  confirming: boolean;
  onRead: (id: string) => void;
  onDeleteRequest: (id: string) => void;
  onDeleteConfirm: (id: string) => void;
  onDeleteCancel: () => void;
  onNavigate: () => void;
}) {
  const { icon, accent } = actionMeta(n.actionType);
  const { oldStatus, newStatus } = n.relatedData ?? {};

  if (confirming) {
    return (
      <div className="px-4 py-3.5 bg-red-50/60 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-700">Delete this notification?</p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onDeleteCancel}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition"
          >
            Keep
          </button>
          <button
            onClick={() => onDeleteConfirm(n._id)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative flex gap-3 px-4 py-3 hover:bg-gray-50/80 transition cursor-pointer ${!n.isRead ? "bg-violet-50/50" : ""}`}
      onClick={() => { if (!n.isRead) onRead(n._id); onNavigate(); }}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${accent}`}>
        {icon}
      </div>

      <div className="flex-1 min-w-0 pr-7">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-snug ${!n.isRead ? "text-gray-900 font-medium" : "text-gray-600"}`}>
            {n.message}
          </p>
          {!n.isRead && (
            <span className="mt-1 w-2 h-2 rounded-full bg-[#7163cc] shrink-0" />
          )}
        </div>

        {oldStatus && newStatus && (
          <div className="flex items-center gap-1.5 mt-1.5">
            {statusBadge(oldStatus)}
            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            {statusBadge(newStatus)}
          </div>
        )}

        <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
      </div>

      {/* Bin icon — visible on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); onDeleteRequest(n._id); }}
        aria-label="Delete notification"
        className="absolute top-1/2 -translate-y-1/2 right-3 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
}

export default function NotificationPanel({ onClose }: Props) {
  const navigate = useNavigate();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const {
    notifications,
    pagination,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  const handleNotificationClick = () => {
    onClose();
    navigate("/dashboard", { state: { section: "orders" } });
  };

  const handleDeleteConfirm = (id: string) => {
    setConfirmDeleteId(null);
    deleteNotification(id);
  };

  return (
    <div className="absolute right-0 top-[calc(100%+8px)] w-80 sm:w-[22rem] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold bg-[#7163cc] text-white rounded-full px-1.5 py-0.5 leading-none">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-[#7163cc] hover:underline font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <NotificationSkeleton key={i} />)
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
            <svg className="w-10 h-10 opacity-25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n._id}
              n={n}
              confirming={confirmDeleteId === n._id}
              onRead={markAsRead}
              onDeleteRequest={(id) => setConfirmDeleteId(id)}
              onDeleteConfirm={handleDeleteConfirm}
              onDeleteCancel={() => setConfirmDeleteId(null)}
              onNavigate={handleNotificationClick}
            />
          ))
        )}
      </div>

      {/* Pagination footer */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50/60">
          <button
            onClick={() => fetchNotifications(pagination.page - 1)}
            disabled={pagination.page <= 1 || loading}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          <span className="text-xs text-gray-400">{pagination.page} / {pagination.pages}</span>
          <button
            onClick={() => fetchNotifications(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages || loading}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
