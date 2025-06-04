// @/pages/WishlistPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/lib/types';
import { getUserWishlist } from '../lib/services/wishlistService'; // Ensure this path is correct
import { Heart } from 'lucide-react';
import { toast } from 'sonner'; // Add toast for user feedback

const WishlistPage = () => {
  const { user, isAuthReady, isLoading: authLoading } = useAuth();
  const [localWishlist, setLocalWishlist] = useState<Product[]>([]);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(true); // True initially

  useEffect(() => {
    const fetchWishlist = async () => {
      // STEP 1: Wait for authentication state to be definitively known
      if (!isAuthReady) {
        // Auth state is still being determined.
        // Keep isLoadingWishlist true to show the spinner.
        console.log("WishlistPage: Auth not ready yet, keeping loading.");
        return;
      }

      // STEP 2: Auth state is ready. Now, check if user is logged in.
      if (!user) {
        console.log("WishlistPage: Auth ready, no user logged in.");
        // User is not logged in. Stop loading, clear wishlist, and show "login" message.
        setIsLoadingWishlist(false);
        setLocalWishlist([]);
        return;
      }

      // STEP 3: User is logged in and auth is ready. Proceed to fetch wishlist.
      console.log("WishlistPage: Auth ready and user logged in. Fetching wishlist...");
      setIsLoadingWishlist(true); // Ensure loading is true before fetching
      try {
        const products = await getUserWishlist();
        setLocalWishlist(products);
        console.log("WishlistPage: Wishlist fetched successfully.");
      } catch (error) {
        console.error("WishlistPage: Error fetching wishlist:", error);
        toast.error("Failed to load your wishlist."); // User feedback for fetch errors
        setLocalWishlist([]);
      } finally {
        console.log("WishlistPage: Finished wishlist fetch attempt.");
        setIsLoadingWishlist(false); // Always stop loading, regardless of success or error
      }
    };

    fetchWishlist();
    // Dependencies ensure this effect re-runs when user or auth status changes
  }, [user, isAuthReady]);

  // Combined loading state for initial auth check and subsequent wishlist fetch
  if (authLoading || isLoadingWishlist) {
    return (
      <PageLayout>
        <div className="container py-12 text-center">
          <div className="flex justify-center items-center h-40">
            <svg className="animate-spin h-10 w-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="ml-3 text-lg text-muted-foreground">Loading your wishlist...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {/* If no user, show a message directing to login */}
        {!user ? (
          <div className="text-center py-12 border rounded-lg bg-muted/30">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-medium mb-4">Please log in to view your wishlist</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Your wishlist will be saved and accessible once you've logged in or created an account.
            </p>
            <Button asChild>
              <Link to="/login">Log In / Register</Link>
            </Button>
          </div>
        ) : localWishlist.length === 0 ? ( // If user exists but wishlist is empty
          <div className="text-center py-12 border rounded-lg bg-muted/30">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-medium mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Add items to your wishlist to keep track of products you're interested in purchasing later.
            </p>
            <Button asChild>
              <Link to="/products">Explore Products</Link>
            </Button>
          </div>
        ) : ( // If user exists and wishlist has items
          <>
            <ProductGrid products={localWishlist} />
            <div className="text-center mt-8">
              <Button variant="outline" asChild className="mr-4">
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default WishlistPage;