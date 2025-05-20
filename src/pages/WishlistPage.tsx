
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const WishlistPage = () => {
  const { wishlist } = useCart();

  return (
    <PageLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Wishlist</h1>
        
        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">
              Add items to your wishlist to keep track of products you're interested in.
            </p>
            <Button asChild>
              <Link to="/products">Explore Products</Link>
            </Button>
          </div>
        ) : (
          <ProductGrid products={wishlist} />
        )}
      </div>
    </PageLayout>
  );
};

export default WishlistPage;
