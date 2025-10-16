import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  token: string;
}

interface Store {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  
  // Wishlist
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (item) => {
        const cart = get().cart;
        const existingItem = cart.find(
          (i) => 
            i.product === item.product && 
            i.size === item.size && 
            i.color === item.color
        );
        
        if (existingItem) {
          set({
            cart: cart.map((i) =>
              i.product === item.product && 
              i.size === item.size && 
              i.color === item.color
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ cart: [...cart, item] });
        }
      },
      removeFromCart: (productId, size, color) => {
        set({
          cart: get().cart.filter(
            (item) => 
              !(item.product === productId && 
                item.size === size && 
                item.color === color)
          ),
        });
      },
      updateQuantity: (productId, quantity, size, color) => {
        set({
          cart: get().cart.map((item) =>
            item.product === productId && 
            item.size === size && 
            item.color === color
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ cart: [] }),
      
      // Wishlist
      wishlist: [],
      addToWishlist: (productId) => {
        const wishlist = get().wishlist;
        if (!wishlist.includes(productId)) {
          set({ wishlist: [...wishlist, productId] });
        }
      },
      removeFromWishlist: (productId) => {
        set({ wishlist: get().wishlist.filter((id) => id !== productId) });
      },
      
      // User
      user: null,
      setUser: (user) => {
        set({ user });
        if (user?.token) {
          localStorage.setItem('token', user.token);
        }
      },
      logout: () => {
        set({ user: null, cart: [], wishlist: [] });
        localStorage.removeItem('token');
      },
      
      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'maison-fernanda-storage',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        user: state.user,
      }),
    }
  )
);

export default useStore;

