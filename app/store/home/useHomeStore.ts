import { create } from "zustand";
import axiosInstance from "~/utilities/axiosInstance";
import type { ProductProps } from "~/interface/ProductProps";

interface HomeStore {
  featuredProducts: ProductProps[];
  popularProducts: ProductProps[];
  allProducts: ProductProps[];

  featuredLoading: boolean;
  popularLoading: boolean;
  allProductsLoading: boolean;

  featuredError: string;
  popularError: string;
  allProductsError: string;

  fetchFeatured: () => Promise<void>;
  fetchPopular: () => Promise<void>;
  fetchAllProducts: () => Promise<void>;
}

const useHomeStore = create<HomeStore>((set, get) => ({
  featuredProducts: [],
  popularProducts: [],
  allProducts: [],

  featuredLoading: false,
  popularLoading: false,
  allProductsLoading: false,

  featuredError: "",
  popularError: "",
  allProductsError: "",

  fetchFeatured: async () => {
    if (get().featuredProducts.length) return;
    set({ featuredLoading: true, featuredError: "" });
    try {
      const { data } = await axiosInstance.get("/featured-products");
      set({ featuredProducts: data.products || [] });
    } catch {
      set({ featuredError: "Failed to load featured products." });
    } finally {
      set({ featuredLoading: false });
    }
  },

  fetchPopular: async () => {
    if (get().popularProducts.length) return;
    set({ popularLoading: true, popularError: "" });
    try {
      const { data } = await axiosInstance.get("/best-selling");
      set({ popularProducts: data.products || [] });
    } catch {
      set({ popularError: "Failed to load popular products." });
    } finally {
      set({ popularLoading: false });
    }
  },

  fetchAllProducts: async () => {
    if (get().allProducts.length) return;
    set({ allProductsLoading: true, allProductsError: "" });
    try {
      const { data } = await axiosInstance.get("/products");
      set({ allProducts: data.products || [] });
    } catch {
      set({ allProductsError: "Failed to load products." });
    } finally {
      set({ allProductsLoading: false });
    }
  },
}));

export default useHomeStore;
