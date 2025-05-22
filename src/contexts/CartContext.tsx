import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { Product, ProductVariant } from '../types/product';
import { useAuth } from './AuthContext';

export type CartItem = {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  total: number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
};

const CartContext = createContext<CartContextType>({
  items: [],
  wishlist: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  total: 0,
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Create user-specific storage keys
  const getCartStorageKey = () => {
    return user ? `streetwear_cart_${user.id}` : 'streetwear_cart_guest';
  };
  
  const getWishlistStorageKey = () => {
    return user ? `streetwear_wishlist_${user.id}` : 'streetwear_wishlist_guest';
  };

  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem(getCartStorageKey());
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const savedWishlist = localStorage.getItem(getWishlistStorageKey());
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Update local storage when cart or wishlist changes
  useEffect(() => {
    localStorage.setItem(getCartStorageKey(), JSON.stringify(items));
  }, [items, user]);

  useEffect(() => {
    localStorage.setItem(getWishlistStorageKey(), JSON.stringify(wishlist));
  }, [wishlist, user]);

  // Load user-specific cart and wishlist when user changes
  useEffect(() => {
    const cartKey = getCartStorageKey();
    const wishlistKey = getWishlistStorageKey();
    
    const savedCart = localStorage.getItem(cartKey);
    const savedWishlist = localStorage.getItem(wishlistKey);
    
    setItems(savedCart ? JSON.parse(savedCart) : []);
    setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
  }, [user]);

  const addToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    setItems(prevItems => {
      // Check if item already exists with the same variant
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id && item.variant.id === variant.id
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        toast.success("Updated quantity in cart");
        return newItems;
      } else {
        // Add new item
        toast.success("Added to cart");
        return [...prevItems, {
          id: `${product.id}-${variant.id}`,
          product,
          variant,
          quantity
        }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast.success("Removed from cart");
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success("Cart cleared");
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const total = items.reduce(
    (sum, item) => sum + (item.variant.price * item.quantity), 
    0
  );

  const addToWishlist = (product: Product) => {
    if (!wishlist.some(item => item.id === product.id)) {
      setWishlist(prev => [...prev, product]);
      toast.success("Added to wishlist");
    } else {
      toast.info("Already in wishlist");
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
    toast.success("Removed from wishlist");
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <CartContext.Provider value={{
      items,
      wishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      total,
      addToWishlist,
      removeFromWishlist,
      isInWishlist
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
