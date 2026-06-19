import { create } from "zustand";
import axiosInstance from "~/utilities/axiosInstance";

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  finalPrice: number;
}

export interface Order {
  _id: string;
  userId?: string;
  items: OrderItem[];
  customer: { name: string; email: string; phone?: string; address?: string };
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceOrderPayload {
  items: { productId: string; quantity: number }[];
  customer: { name: string; email: string; phone?: string; address?: string };
  paymentMethod?: string;
  notes?: string;
  deliveryCharge?: number;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  placing: boolean;
  error: string | null;

  fetchUserOrders: (userId: string) => Promise<void>;
  placeOrder: (payload: PlaceOrderPayload) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
}

const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  placing: false,
  error: null,

  fetchUserOrders: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/orders/user/${userId}`);
      set({ orders: Array.isArray(data) ? data : [] });
    } catch (err: any) {
      if (err.response?.status === 404) {
        set({ orders: [] });
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
      set((s) => ({ orders: [data, ...s.orders] }));
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
