
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Product } from '@/lib/types';
import { getUserWishlist, addToWishlist, removeFromWishlist } from '@/lib/services/wishlistService';
import { toast } from 'sonner';

export type CartItem = {
  id: string;
  product: Product;
  variant: {
    id: string;
    name: string;
    price: number;
    stock: number;
  };
  quantity: number;
}

export type CartContextType = {
  cart: CartItem[];
  items: CartItem[];
  cartItems: CartItem[]; // Added this missing property
  wishlist: Product[];
  addToCart: (product: Product, variant?: any, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  total: number;
  cartCount: number;
  totalItems: number;
  toggleWishlist: (product: Product) => Promise<void>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
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
  
  const addToCart = (product: Product, variant?: any, quantity = 1) => {
    // Use default variant if none provided
    const selectedVariant = variant || {
      id: 'default',
      name: 'Default',
      price: product.price,
      stock: 100
    };

    setCart(prevCart => {
      // Check if item is already in cart
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id && item.variant.id === selectedVariant.id
      );
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        toast.success('Updated quantity in cart');
        return updatedCart;
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: `${product.id}-${selectedVariant.id}`,
          product,
          variant: selectedVariant,
          quantity
        };
        toast.success('Added to cart');
        return [...prevCart, newItem];
      }
    });
  };
  
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    toast.info('Removed from cart');
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId 
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
    (total, item) => total + item.variant.price * item.quantity, 
    0
  );

  const total = cartTotal;
  const items = cart;
  const cartItems = cart; // Alias for compatibility
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const totalItems = cartCount;
  
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

  const addToWishlistMethod = async (product: Product) => {
    try {
      await addToWishlist(product.id);
      setWishlist(prev => [...prev, { ...product, is_in_wishlist: true }]);
      toast.success('Added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  const removeFromWishlistMethod = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      setWishlist(prev => prev.filter(item => item.id !== productId));
      toast.info('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };
  
  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };
  
  return (
    <CartContext.Provider value={{ 
      cart,
      items,
      cartItems,
      wishlist,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartTotal,
      total,
      cartCount,
      totalItems,
      toggleWishlist,
      addToWishlist: addToWishlistMethod,
      removeFromWishlist: removeFromWishlistMethod,
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
