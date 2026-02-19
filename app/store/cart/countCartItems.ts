import { create } from "zustand";

export interface CartItem {
  productID: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartCountProps {
  cartItems: number; // total quantity of all items
  cartList: CartItem[]; // array of cart items

  initializeFromLocalStorage: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (productID: string, count?: number) => void;

  getCartItems: () => CartItem[];
}

const useCountCartItems = create<CartCountProps>((set, get) => ({
  cartItems: 0,
  cartList: [],

  initializeFromLocalStorage: () => {
    const storedItems: CartItem[] = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );
    const totalQuantity = storedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    set({ cartItems: totalQuantity, cartList: storedItems });
  },

  addItem: (newItem) => {
    set(() => {
      const currentItems: CartItem[] = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      const existingIndex = currentItems.findIndex(
        (item) => item.productID === newItem.productID
      );

      if (existingIndex !== -1) {
        currentItems[existingIndex].quantity += newItem.quantity;
      } else {
        currentItems.push(newItem);
      }

      localStorage.setItem("cart", JSON.stringify(currentItems));

      const totalQuantity = currentItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      return { cartItems: totalQuantity, cartList: currentItems };
    });
  },

  removeItem: (productID, count = 1) => {
    set(() => {
      const currentItems: CartItem[] = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      const existingIndex = currentItems.findIndex(
        (item) => item.productID === productID
      );

      if (existingIndex !== -1) {
        currentItems[existingIndex].quantity -= count;

        if (currentItems[existingIndex].quantity <= 0) {
          currentItems.splice(existingIndex, 1);
        }
      }

      localStorage.setItem("cart", JSON.stringify(currentItems));

      const totalQuantity = currentItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      return { cartItems: totalQuantity, cartList: currentItems };
    });
  },

  getCartItems: () => {
    return get().cartList;
  },
}));

export default useCountCartItems;
