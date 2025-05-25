
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/lib/types';
import { getUserWishlist } from '@/lib/services/wishlistService';
import { Heart } from 'lucide-react';

const WishlistPage = () => {
  const { wishlist } = useCart();
  const [localWishlist, setLocalWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      try {
        const products = await getUserWishlist();
        setLocalWishlist(products);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Convert Product[] to the expected format for ProductGrid
  const wishlistProducts = localWishlist.map(product => ({
    ...product,
    category: product.category || { id: '', name: '', slug: '' },
    tags: product.tags || [],
    variants: product.variants || []
  }));

  return (
    <PageLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse">Loading wishlist items...</div>
          </div>
        ) : localWishlist.length === 0 ? (
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
        ) : (
          <>
            <ProductGrid products={wishlistProducts} />
            {localWishlist.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" asChild className="mr-4">
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default WishlistPage;
