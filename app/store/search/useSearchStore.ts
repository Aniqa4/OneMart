import { create } from "zustand";
import axiosInstance from "~/utilities/axiosInstance";
import type { ProductProps } from "~/interface/ProductProps";

interface SearchStore {
  results: ProductProps[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string;
  search: (name: string, page?: number, limit?: number) => Promise<void>;
}

const useSearchStore = create<SearchStore>((set) => ({
  results: [],
  total: 0,
  totalPages: 0,
  loading: false,
  error: "",

  search: async (name, page = 1, limit = 20) => {
    set({ loading: true, error: "", results: [] });
    try {
      const { data } = await axiosInstance.get(
        `/search-products/${encodeURIComponent(name)}`,
        { params: { page, limit } }
      );
      set({
        results: data.products || data || [],
        total: data.total ?? 0,
        totalPages:
          data.totalPages ?? Math.ceil((data.total ?? 0) / limit),
      });
    } catch {
      set({ error: "Search failed. Please try again." });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useSearchStore;
