// src/contexts/CartContext.tsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Product, ProductVariant } from '@/lib/types';
import { getUserWishlist, addToWishlist, removeFromWishlist } from '@/lib/services/wishlistService';
import { fetchUserCartItems } from '@/lib/services/cartService';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

type SimpleProductVariant = {
  id: string;
  name: string;
  price: number;
  stock: number;
  color?: string | null;
  color_hex?: string | null;
}

export type CartItem = {
  id: string;
  product: Product;
  variant: ProductVariant | SimpleProductVariant;
  quantity: number;
}

export type CartContextType = {
  cart: CartItem[];
  items: CartItem[];
  cartItems: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
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
  const [userId, setUserId] = useState<string | null>(null);

  // Effect to fetch user session and set up auth state listener
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Define upsertCartItemToDatabase using useCallback
  const upsertCartItemToDatabase = useCallback(async (
    productId: string,
    variantId: string | null,
    quantityChange: number // This is the change in quantity (+/-)
  ) => {
    if (!userId) {
      console.warn('User not logged in. Cart changes will not be saved to database.');
      return;
    }

    try {
      const { data: existingCartItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .eq('variant_id', variantId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + quantityChange;
        if (newQuantity <= 0) {
          // If quantity becomes 0 or less, delete the item
          const { error: deleteError } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', existingCartItem.id);
          if (deleteError) throw deleteError;
        } else {
          // Update quantity for existing item
          const { error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity: newQuantity })
            .eq('id', existingCartItem.id);
          if (updateError) throw updateError;
        }
      } else if (quantityChange > 0) {
        // Only insert if it's a new item and quantity is positive
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            product_id: productId,
            variant_id: variantId,
            quantity: quantityChange, // quantityChange is the initial quantity for a new item
          });
        if (insertError) throw insertError;
      }
    } catch (error: any) {
      console.error('Error updating cart in database:', error.message);
      toast.error('Failed to update cart in database.');
    }
  }, [userId]); // Dependency on userId

  // Load cart from DB and wishlist from DB based on userId
  useEffect(() => {
    const loadData = async () => {
      if (userId) {
        // --- Handle guest cart migration on login ---
        const savedGuestCart = localStorage.getItem('cart');
        if (savedGuestCart) {
          try {
            const guestCartItems: CartItem[] = JSON.parse(savedGuestCart);
            if (guestCartItems.length > 0) {
              toast.info('Merging guest cart with your account...');
              // Iterate through guest items and upsert them to the database
              for (const item of guestCartItems) {
                const dbVariantId = item.variant.id.startsWith('simple-') ? null : item.variant.id;
                // Call upsertCartItemToDatabase for each guest item, treating quantity as an addition
                await upsertCartItemToDatabase(item.product.id, dbVariantId, item.quantity);
              }
              toast.success('Guest cart merged!');
            }
          } catch (e) {
            console.error('Error parsing guest cart from localStorage during merge:', e);
            toast.error('Failed to merge guest cart.');
          } finally {
            // Always clear local storage after attempting merge, whether successful or not
            localStorage.removeItem('cart');
          }
        }
        // --- End guest cart migration ---

        // Fetch cart from database for logged-in user (this now includes merged guest items)
// Fetch cart from database for logged-in user (this now includes merged guest items)
        try {
          const dbCartItems = await fetchUserCartItems(userId);
          setCart(dbCartItems);
          toast.success('Cart loaded from database!');
        } catch (error) { // <--- The problematic dot was right before this line
          console.error('Error fetching cart from database:', error);
          toast.error('Failed to load cart from database.');
          setCart([]);
        }

        // Load wishlist if user is logged in
        try {
          const wishlistItems = await getUserWishlist();
          setWishlist(wishlistItems);
        } catch (error) {
          console.error('Error fetching wishlist:', error);
          toast.error('Failed to load wishlist.');
        }
      } else {
        // If no user, load cart from localStorage (for guest users)
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            setCart(JSON.parse(savedCart));
          } catch (e) {
            console.error('Error parsing cart from localStorage:', e);
            localStorage.removeItem('cart');
            setCart([]);
          }
        } else {
          setCart([]);
        }
        setWishlist([]); // Clear wishlist if user logs out or is not logged in
      }
    };

    // Include fetchUserCartItems and getUserWishlist as dependencies for full correctness
    // as they are used in the effect. upsertCartItemToDatabase is also a dependency.
    loadData();
  }, [userId, upsertCartItemToDatabase, fetchUserCartItems, getUserWishlist]); // Add dependencies

  // Save cart to localStorage whenever the cart state changes (for both guest and logged-in users,
  // acting as a local cache that gets overwritten by DB on login)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // All action functions are wrapped in useCallback
  const addToCart = useCallback((product: Product, variant?: ProductVariant, quantity = 1) => {
    let itemVariant: ProductVariant | SimpleProductVariant;
    let dbVariantId: string | null = null;

    if (product.variants && product.variants.length > 0) {
      if (!variant) {
        console.warn("Product has variants, but none was selected. User must select a variant.");
        toast.error("Please select a size and/or color for this product.");
        return;
      }
      itemVariant = variant;
      dbVariantId = variant.id;
    } else {
      // Handle products without explicit variants (simple products)
      itemVariant = {
        id: `simple-${product.id}`, // Unique ID for simple product "variant"
        name: 'Default',
        price: product.price,
        stock: product.stock_quantity || 0,
        color: null,
        color_hex: null
      };
      dbVariantId = null; // No specific variant_id for simple products in DB
    }

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id && item.variant.id === itemVariant.id
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        toast.success('Updated quantity in cart');
        // If item exists, upsert with the quantity as change (+quantity)
        upsertCartItemToDatabase(product.id, dbVariantId, quantity);
        return updatedCart;
      } else {
        const newItem: CartItem = {
          id: uuidv4(), // Assign a temporary local UUID for new items
          product,
          variant: itemVariant,
          quantity
        };
        toast.success('Added to cart');
        // If new item, upsert with the quantity as the initial amount
        upsertCartItemToDatabase(product.id, dbVariantId, quantity);
        return [...prevCart, newItem];
      }
    });
  }, [upsertCartItemToDatabase]); // Dependency on upsertCartItemToDatabase

  const removeFromCart = useCallback(async (localCartItemId: string) => {
    const itemToRemove = cart.find(item => item.id === localCartItemId);
    if (!itemToRemove) {
      toast.error('Item not found in cart.');
      return;
    }

    // Determine the database variant ID. If it's a simple product, dbVariantId is null.
    const dbVariantId = itemToRemove.variant.id.startsWith('simple-') ? null : itemToRemove.variant.id;

    if (userId) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', itemToRemove.product.id)
          .eq('variant_id', dbVariantId); // Use dbVariantId for lookup

        if (error) throw error;
        toast.info('Removed from database cart.');
      } catch (error: any) {
        console.error('Error removing cart item from database:', error.message);
        toast.error('Failed to remove item from database cart.');
      }
    } else {
      console.warn('User not logged in. Item removed only from local cart.');
    }

    setCart(prevCart => prevCart.filter(item => item.id !== localCartItemId));
    toast.info('Removed from cart');
  }, [userId, cart]); // Dependency on userId and cart (for find)

  const updateQuantity = useCallback(async (localCartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(localCartItemId); // Remove item if quantity goes to 0 or less
      return;
    }

    const itemToUpdate = cart.find(item => item.id === localCartItemId);
    if (!itemToUpdate) {
      toast.error('Item not found in cart.');
      return;
    }

    const dbVariantId = itemToUpdate.variant.id.startsWith('simple-') ? null : itemToUpdate.variant.id;

    if (userId) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: quantity }) // Update with the exact new quantity
          .eq('user_id', userId)
          .eq('product_id', itemToUpdate.product.id)
          .eq('variant_id', dbVariantId);

        if (error) throw error;
        toast.info('Cart quantity updated in database.');
      } catch (error: any) {
        console.error('Error updating cart quantity in database:', error.message);
        toast.error('Failed to update quantity in database.');
      }
    } else {
      console.warn('User not logged in. Quantity updated only in local cart.');
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === localCartItemId
          ? { ...item, quantity }
          : item
      )
    );
    toast.info('Cart quantity updated');
  }, [userId, cart, removeFromCart]); // Dependencies on userId, cart, and removeFromCart

  const clearCart = useCallback(async () => {
    if (!userId) {
      toast.warn('User not logged in. Clearing local cart only.');
      setCart([]);
      toast.info('Local cart cleared');
      return;
    }
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      setCart([]);
      toast.info('Cart cleared from database and local storage');
    } catch (error: any) {
      console.error('Error clearing cart from database:', error.message);
      toast.error('Failed to clear cart.');
    }
  }, [userId]); // Dependency on userId

  const cartTotal = cart.reduce(
    (total, item) => total + item.variant.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const toggleWishlist = useCallback(async (product: Product) => {
    const isProductInWishlist = wishlist.some(item => item.id === product.id);

    try {
      if (!userId) {
        toast.error('Please login to manage your wishlist.');
        return;
      }
      if (isProductInWishlist) {
        await removeFromWishlist(product.id);
        setWishlist(prev => prev.filter(item => item.id !== product.id));
        toast.info('Removed from wishlist');
      } else {
        await addToWishlist(product.id);
        setWishlist(prev => [...prev, { ...product, is_in_wishlist: true }]);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  }, [userId, wishlist]); // Dependencies on userId and wishlist

  const addToWishlistMethod = useCallback(async (product: Product) => {
    if (!userId) {
        toast.error('Please login to add items to wishlist.');
        return;
    }
    if (wishlist.some(item => item.id === product.id)) {
        toast.info('Product is already in your wishlist.');
        return;
    }
    try {
      await addToWishlist(product.id);
      setWishlist(prev => [...prev, { ...product, is_in_wishlist: true }]);
      toast.success('Added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  }, [userId, wishlist]); // Dependencies on userId and wishlist

  const removeFromWishlistMethod = useCallback(async (productId: string) => {
    if (!userId) {
        toast.error('Please login to remove items from wishlist.');
        return;
    }
    try {
      await removeFromWishlist(productId);
      setWishlist(prev => prev.filter(item => item.id !== productId));
      toast.info('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  }, [userId]); // Dependency on userId

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]); // Dependency on wishlist

  return (
    <CartContext.Provider value={{
      cart,
      items: cart,
      cartItems: cart,
      wishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      total: cartTotal,
      cartCount,
      totalItems: cartCount,
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