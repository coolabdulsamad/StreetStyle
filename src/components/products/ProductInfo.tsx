
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: selectedVariant.price,
      images: product.images,
      variant: selectedVariant
    });

    toast.success('Added to cart!');
  };

  const handleAddToWishlist = () => {
    toast.success('Added to wishlist!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center gap-2 mb-4">
          {product.new && <Badge variant="secondary">New</Badge>}
          {product.featured && <Badge>Featured</Badge>}
          {product.is_limited_edition && <Badge variant="destructive">Limited Edition</Badge>}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating} ({product.review_count} reviews)
          </span>
        </div>
      </div>

      <div className="text-2xl font-bold">
        ${selectedVariant?.price || product.price}
      </div>

      <p className="text-muted-foreground">{product.description}</p>

      {product.variants && product.variants.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Select Variant:</h3>
          <div className="grid grid-cols-2 gap-2">
            {product.variants.map((variant) => (
              <Button
                key={variant.id}
                variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                onClick={() => setSelectedVariant(variant)}
                className="text-sm"
              >
                {variant.size} - ${variant.price}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={handleAddToCart} className="flex-1">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
        <Button variant="outline" onClick={handleAddToWishlist}>
          <Heart className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        <p><strong>Category:</strong> {product.category.name}</p>
        <p><strong>Brand:</strong> {product.brand || 'N/A'}</p>
        <p><strong>SKU:</strong> {product.sku}</p>
        {product.tags && (
          <div>
            <strong>Tags:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {product.tags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
