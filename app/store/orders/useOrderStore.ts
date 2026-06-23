import { create } from "zustand";
import axiosInstance from "~/utilities/axiosInstance";

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  variantLabel?: string;
  sizeLabel?: string;
  price: number;
  quantity: number;
  finalPrice: number;
}

export interface Order {
  _id: string;
  userId?: string;
  items: OrderItem[];
  customer: { name: string; email: string; address: string; phone: string };
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: string;
  notes?: string;
  isGuest: boolean;
  createdAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PlaceOrderPayload {
  items: { productId: string; quantity: number; variantLabel?: string; sizeLabel?: string }[];
  customer: { name: string; email: string; address: string; phone: string };
  paymentMethod: string;
  deliveryCharge: number;
  notes?: string;
}

interface OrderState {
  orders: Order[];
  pagination: Pagination | null;
  loading: boolean;
  placing: boolean;
  error: string | null;

  fetchUserOrders: (userId: string, page?: number, limit?: number) => Promise<void>;
  placeOrder: (payload: PlaceOrderPayload) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
}

const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  pagination: null,
  loading: false,
  placing: false,
  error: null,

  fetchUserOrders: async (userId, page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/orders/user/${userId}`, {
        params: { page, limit },
      });
      set({
        orders: Array.isArray(data.orders) ? data.orders : [],
        pagination: data.pagination ?? null,
      });
    } catch (err: any) {
      if (err.response?.status === 404) {
        set({ orders: [], pagination: null });
      } else {
        set({ error: err.response?.data?.message || "Failed to load orders" });
      }
    } finally {
      set({ loading: false });
    }
  },

  placeOrder: async (payload) => {
    set({ placing: true, error: null });
    try {
      const { data } = await axiosInstance.post("/orders", payload);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to place order";
      set({ error: msg });
      throw new Error(msg);
    } finally {
      set({ placing: false });
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const { data } = await axiosInstance.patch(`/orders/${orderId}/cancel`);
      set((s) => ({
        orders: s.orders.map((o) => (o._id === orderId ? data : o)),
      }));
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to cancel order";
      throw new Error(msg);
    }
  },
}));

export default useOrderStore;
