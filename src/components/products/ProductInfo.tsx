
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Ruler } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user } = useAuth();

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    addToCart(product, selectedVariant);
    toast.success('Added to cart!');
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }
    await toggleWishlist(product);
  };

  const isProductInWishlist = isInWishlist(product.id);

  return (
    <div className="space-y-6">
      {/* Product Title & Badges */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {product.new && <Badge variant="secondary">New</Badge>}
          {product.featured && <Badge>Featured</Badge>}
          {product.is_limited_edition && <Badge variant="destructive">Limited Edition</Badge>}
          {product.brand && <Badge variant="outline">{product.brand}</Badge>}
        </div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        
        {/* Rating & Reviews */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
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
            <span className="text-sm text-muted-foreground ml-2">
              {product.rating} ({product.review_count} reviews)
            </span>
          </div>
        </div>

        {/* SKU & Availability */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span><strong>SKU:</strong> {product.sku}</span>
          <span className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div className="space-y-2">
        <div className="text-3xl font-bold">
          ${selectedVariant?.price || product.price}
          {product.original_price && product.original_price > product.price && (
            <span className="text-lg text-muted-foreground line-through ml-2">
              ${product.original_price}
            </span>
          )}
        </div>
        {product.is_sale && (
          <Badge variant="destructive">
            Save ${(product.original_price || 0) - product.price}
          </Badge>
        )}
      </div>

      <Separator />

      {/* Product Description */}
      <div>
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
      </div>

      {/* Product Details */}
      <div className="space-y-3">
        <h3 className="font-semibold">Product Details</h3>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Category:</span>
            <span>{product.category.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Brand:</span>
            <span>{product.brand || 'N/A'}</span>
          </div>
          {product.gender && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gender:</span>
              <span className="capitalize">{product.gender}</span>
            </div>
          )}
          {product.release_date && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Release Date:</span>
              <span>{new Date(product.release_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Size/Variant Selection */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Select Size:</h3>
            <Button variant="ghost" size="sm" className="text-primary">
              <Ruler className="w-4 h-4 mr-1" />
              Size Guide
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {product.variants.map((variant) => (
              <Button
                key={variant.id}
                variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                onClick={() => setSelectedVariant(variant)}
                className="text-sm"
                disabled={variant.stock === 0}
              >
                {variant.size} {variant.stock === 0 && '(Out)'}
              </Button>
            ))}
          </div>
          {selectedVariant && (
            <p className="text-sm text-muted-foreground">
              Price: ${selectedVariant.price} • Stock: {selectedVariant.stock} available
            </p>
          )}
        </div>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Tags</h3>
          <div className="flex flex-wrap gap-1">
            {product.tags.map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <Button 
            onClick={handleAddToCart} 
            className="flex-1" 
            size="lg"
            disabled={product.stock_quantity === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleToggleWishlist}
            size="lg"
            className={isProductInWishlist ? 'text-red-500 border-red-500' : ''}
          >
            <Heart className={`w-4 h-4 ${isProductInWishlist ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center justify-center p-2 bg-gray-50 rounded">
            <Truck className="w-4 h-4 mr-1" />
            Free Shipping
          </div>
          <div className="flex items-center justify-center p-2 bg-gray-50 rounded">
            <Shield className="w-4 h-4 mr-1" />
            Authentic
          </div>
          <div className="flex items-center justify-center p-2 bg-gray-50 rounded">
            <RotateCcw className="w-4 h-4 mr-1" />
            30-Day Return
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
