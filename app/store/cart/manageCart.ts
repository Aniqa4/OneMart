import { create } from "zustand";

// Step 1: Define the shape of the store
interface ManageCartStore {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

// Step 2: Create the store using the interface
const useManageCart = create<ManageCartStore>((set) => ({
  isOpen: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useManageCart;
