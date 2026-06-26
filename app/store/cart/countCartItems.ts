import { create } from "zustand";
import axiosInstance from "~/utilities/axiosInstance";

export interface CartItem {
  _id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  discountedPrice: number;
  variantLabel?: string;
  sizeLabel?: string;
  quantity: number;
  finalPrice: number;
}

export interface AddItemPayload {
  productId: string;
  quantity: number;
  variantLabel?: string;
  sizeLabel?: string;
  // required for guest (localStorage) mode
  productName?: string;
  productImage?: string;
  price?: number;
  discountedPrice?: number;
  finalPrice?: number;
}

interface CartStore {
  cartItems: number;
  cartList: CartItem[];
  cartLoading: boolean;

  fetchCart: () => Promise<void>;
  addItem: (payload: AddItemPayload) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const LOCAL_KEY = "cart";
const isAuth = () => !!localStorage.getItem("accessToken");
const syncCount = (items: CartItem[]) => items.reduce((s, i) => s + i.quantity, 0);

const readLocal = (): CartItem[] => {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); }
  catch { return []; }
};
const writeLocal = (items: CartItem[]) =>
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));

const localId = (productId: string, variantLabel?: string, sizeLabel?: string) =>
  [productId, variantLabel || "", sizeLabel || ""].join("__");

const useCountCartItems = create<CartStore>((set, get) => ({
  cartItems: 0,
  cartList: [],
  cartLoading: false,

  fetchCart: async () => {
    if (get().cartLoading) return;

    if (!isAuth()) {
      const items = readLocal();
      set({ cartList: items, cartItems: syncCount(items) });
      return;
    }

    set({ cartLoading: true });
    try {
      const { data } = await axiosInstance.get("/cart");
      const items: CartItem[] = data.items || [];
      set({ cartList: items, cartItems: syncCount(items) });
    } catch {
      // keep existing state on error
    } finally {
      set({ cartLoading: false });
    }
  },

  addItem: async (payload) => {
    if (!isAuth()) {
      const id = localId(payload.productId, payload.variantLabel, payload.sizeLabel);
      const items = readLocal();
      const idx = items.findIndex((i) => i._id === id);
      if (idx !== -1) {
        items[idx].quantity += payload.quantity;
      } else {
        items.push({
          _id: id,
          productId: payload.productId,
          productName: payload.productName || "",
          productImage: payload.productImage || "",
          price: payload.price || 0,
          discountedPrice: payload.discountedPrice || 0,
          variantLabel: payload.variantLabel,
          sizeLabel: payload.sizeLabel,
          quantity: payload.quantity,
          finalPrice: payload.finalPrice ?? payload.price ?? 0,
        });
      }
      writeLocal(items);
      set({ cartList: items, cartItems: syncCount(items) });
      return;
    }

    const { data } = await axiosInstance.post("/cart/items", {
      productId: payload.productId,
      quantity: payload.quantity,
      variantLabel: payload.variantLabel,
      sizeLabel: payload.sizeLabel,
    });
    const items: CartItem[] = data.items || [];
    set({ cartList: items, cartItems: syncCount(items) });
  },

  updateQuantity: async (itemId, quantity) => {
    if (!isAuth()) {
      const items = readLocal();
      const idx = items.findIndex((i) => i._id === itemId);
      if (idx !== -1) {
        if (quantity <= 0) {
          items.splice(idx, 1);
        } else {
          items[idx].quantity = quantity;
        }
      }
      writeLocal(items);
      set({ cartList: items, cartItems: syncCount(items) });
      return;
    }

    const updated = get().cartList
      .map((i) => (i._id === itemId ? { ...i, quantity } : i))
      .filter((i) => i.quantity > 0);
    set({ cartList: updated, cartItems: syncCount(updated) });
    await axiosInstance.put(`/cart/items/${itemId}`, { quantity });
  },

  removeItem: async (itemId) => {
    if (!isAuth()) {
      const items = readLocal().filter((i) => i._id !== itemId);
      writeLocal(items);
      set({ cartList: items, cartItems: syncCount(items) });
      return;
    }

    const updated = get().cartList.filter((i) => i._id !== itemId);
    set({ cartList: updated, cartItems: syncCount(updated) });
    await axiosInstance.delete(`/cart/items/${itemId}`);
  },

  clearCart: async () => {
    if (!isAuth()) {
      writeLocal([]);
      set({ cartList: [], cartItems: 0 });
      return;
    }

    await axiosInstance.delete("/cart");
    set({ cartList: [], cartItems: 0 });
  },
}));

export default useCountCartItems;
