
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Product } from '@/lib/types';
import { getUserWishlist, addToWishlist, removeFromWishlist } from '@/lib/services/wishlistService';
import { toast } from 'sonner';

export type CartItem = {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export type CartContextType = {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart from localStorage:', e);
        localStorage.removeItem('cart');
      }
    }
    
    // Load wishlist
    const fetchWishlist = async () => {
      try {
        const wishlistItems = await getUserWishlist();
        setWishlist(wishlistItems);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };
    
    fetchWishlist();
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    setCart(prevCart => {
      // Check if item is already in cart
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id && 
                item.size === size && 
                item.color === color
      );
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        toast.success('Updated quantity in cart');
        return updatedCart;
      } else {
        // Add new item to cart
        toast.success('Added to cart');
        return [...prevCart, { product, quantity, size, color }];
      }
    });
  };
  
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    toast.info('Removed from cart');
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
    toast.info('Cart cleared');
  };
  
  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity, 
    0
  );
  
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  
  const toggleWishlist = async (product: Product) => {
    const isProductInWishlist = isInWishlist(product.id);
    
    try {
      if (isProductInWishlist) {
        // Remove from wishlist
        await removeFromWishlist(product.id);
        setWishlist(prev => prev.filter(item => item.id !== product.id));
        toast.info('Removed from wishlist');
      } else {
        // Add to wishlist
        await addToWishlist(product.id);
        setWishlist(prev => [...prev, { ...product, is_in_wishlist: true }]);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };
  
  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };
  
  return (
    <CartContext.Provider value={{ 
      cart, 
      wishlist,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartTotal, 
      cartCount,
      toggleWishlist,
      isInWishlist
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
