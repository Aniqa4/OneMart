import { create } from "zustand";
import axiosInstance from "~/utilities/axiosInstance";

interface CategoryStore {
  categories: any[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.get("/categories");
      set({
        categories: Array.isArray(data.categories) ? data.categories : [],
        loading: false,
      });
    } catch (err) {
      console.error("Error fetching categories:", err);
      set({
        loading: false,
        error: "Failed to load categories",
      });
    }
  },
}));

export default useCategoryStore;
