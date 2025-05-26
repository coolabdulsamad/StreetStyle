
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useCart();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Ensure category has all required properties
    const fullCategory = {
      id: product.category.id || '',
      name: product.category.name || '',
      slug: product.category.slug || '',
      description: product.category.description || null,
      parent_id: product.category.parent_id || null,
      image_url: product.category.image_url || null,
      is_active: product.category.is_active || true,
      display_order: product.category.display_order || 0,
      created_at: product.category.created_at || new Date().toISOString()
    };
    
    // Convert product to the format expected by toggleWishlist
    const productForWishlist = {
      ...product,
      category: fullCategory,
      brand_id: product.brand_id || null,
      sku: product.sku || null,
      gender: product.gender || null,
      release_date: product.release_date || null,
      is_limited_edition: product.is_limited_edition || null,
      average_rating: product.average_rating || null,
      review_count: product.review_count || 0,
      meta_title: product.meta_title || null,
      meta_description: product.meta_description || null
    };
    
    await toggleWishlist(productForWishlist);
  };

  return (
    <Card className="overflow-hidden h-full group">
      <Link to={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {product.new && (
            <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
              NEW
            </span>
          )}
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-2 right-2 bg-white/70 hover:bg-white"
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-5 w-5 ${inWishlist ? 'fill-primary text-primary' : ''}`} />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="mb-1 text-sm text-muted-foreground">{product.category.name}</div>
          <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="font-bold">${product.price}</span>
            {product.rating && (
              <div className="flex items-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-yellow-500 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
                {product.rating}
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
