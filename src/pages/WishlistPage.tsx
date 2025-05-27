
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types/product';
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
        // Convert ExtendedProduct to Product format
        const convertedProducts = products.map(product => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          images: product.images,
          category: {
            id: product.category?.id || '',
            name: product.category?.name || '',
            slug: product.category?.slug || '',
            description: product.category?.description || '',
            parent_id: product.category?.parent_id || null,
            image_url: product.category?.image_url || null,
            is_active: product.category?.is_active ?? true,
            display_order: product.category?.display_order || 0,
            created_at: product.category?.created_at || new Date().toISOString()
          },
          tags: product.tags || [],
          variants: product.variants || [],
          featured: product.featured,
          new: product.new,
          rating: product.rating,
          reviews: (product.reviews || []).map(review => ({
            id: review.id,
            product_id: product.id,
            user_id: review.user_id,
            userName: review.userName || 'Anonymous',
            rating: review.rating,
            review_text: review.review_text || '',
            verified_purchase: true,
            helpful_votes: 0,
            images: [],
            created_at: review.created_at,
            updated_at: review.created_at
          })),
          brand_id: product.brand_id || null,
          sku: product.sku || null,
          gender: product.gender || null,
          release_date: product.release_date || null,
          is_limited_edition: product.is_limited_edition || null,
          average_rating: product.average_rating || null,
          review_count: product.review_count || 0,
          meta_title: product.meta_title || null,
          meta_description: product.meta_description || null
        })) as Product[];
        
        setLocalWishlist(convertedProducts);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, []);

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
            <ProductGrid products={localWishlist} />
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
