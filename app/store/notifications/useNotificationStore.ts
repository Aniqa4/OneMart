import { create } from "zustand";
import axiosInstance from "~/utilities/axiosInstance";

export interface NotificationRelatedData {
  productId?: string;
  orderId?: string;
  oldStatus?: string;
  newStatus?: string;
}

export interface Notification {
  _id: string;
  userId: string;
  message: string;
  actionType: string;
  isRead: boolean;
  relatedData?: NotificationRelatedData;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface NotificationState {
  notifications: Notification[];
  pagination: Pagination | null;
  unreadCount: number;
  loading: boolean;

  fetchUnreadCount: () => Promise<void>;
  fetchNotifications: (page?: number, limit?: number) => Promise<void>;
  fetchByType: (actionType: string, page?: number, limit?: number) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  pagination: null,
  unreadCount: 0,
  loading: false,

  fetchUnreadCount: async () => {
    try {
      const { data } = await axiosInstance.get("/notifications/unread-count");
      set({ unreadCount: data.unreadCount ?? 0 });
    } catch {
      // silently fail
    }
  },

  fetchNotifications: async (page = 1, limit = 10) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get("/notifications", {
        params: { page, limit },
      });
      const notifications: Notification[] = data.notifications ?? [];
      set({
        notifications,
        pagination: data.pagination ?? null,
        unreadCount: notifications.filter((n) => !n.isRead).length,
      });
    } catch {
      // silently fail — notifications are non-critical
    } finally {
      set({ loading: false });
    }
  },

  fetchByType: async (actionType, page = 1, limit = 10) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get("/notifications/by-type", {
        params: { actionType, page, limit },
      });
      set({
        notifications: data.notifications ?? [],
        pagination: data.pagination ?? null,
      });
    } catch {
      // silently fail
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      set((s) => ({
        notifications: s.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, s.unreadCount - 1),
      }));
    } catch {
      // ignore
    }
  },

  markAllAsRead: async () => {
    try {
      await axiosInstance.put("/notifications/read-all");
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch {
      // ignore
    }
  },

  deleteNotification: async (id) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      set((s) => {
        const target = s.notifications.find((n) => n._id === id);
        return {
          notifications: s.notifications.filter((n) => n._id !== id),
          unreadCount: target && !target.isRead
            ? Math.max(0, s.unreadCount - 1)
            : s.unreadCount,
        };
      });
    } catch {
      // ignore
    }
  },
}));

export default useNotificationStore;
