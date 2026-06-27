import { create } from "zustand";
import axiosInstance from "~/utilities/axiosInstance";
import type { ProductProps } from "~/interface/ProductProps";

interface WishlistStore {
  wishlistIds: string[];
  wishlistProducts: ProductProps[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
}

const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlistIds: [],
  wishlistProducts: [],
  loading: false,

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get("/wishlist");
      const products: ProductProps[] = data.products || [];
      set({
        wishlistProducts: products,
        wishlistIds: products.map((p) => p._id),
      });
    } catch {
      // keep existing state on error
    } finally {
      set({ loading: false });
    }
  },

  addToWishlist: async (productId) => {
    set((s) => ({ wishlistIds: [...s.wishlistIds, productId] }));
    try {
      await axiosInstance.post("/wishlist/items", { productId });
      await get().fetchWishlist();
    } catch {
      set((s) => ({ wishlistIds: s.wishlistIds.filter((id) => id !== productId) }));
      throw new Error("Failed to add to wishlist");
    }
  },

  removeFromWishlist: async (productId) => {
    const prev = get();
    set((s) => ({
      wishlistIds: s.wishlistIds.filter((id) => id !== productId),
      wishlistProducts: s.wishlistProducts.filter((p) => p._id !== productId),
    }));
    try {
      await axiosInstance.delete(`/wishlist/items/${productId}`);
    } catch {
      set({ wishlistIds: prev.wishlistIds, wishlistProducts: prev.wishlistProducts });
      throw new Error("Failed to remove from wishlist");
    }
  },

  isWishlisted: (productId) => get().wishlistIds.includes(productId),
}));

export default useWishlistStore;
