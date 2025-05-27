
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Heart, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, addToWishlist, wishlist } = useCart();

  const isInWishlist = wishlist.some(item => item.id === product.id);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: selectedVariant?.price || product.price,
      image: product.images[0],
      variant: selectedVariant?.name,
      quantity: quantity
    });
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Product Title and Rating */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center space-x-2 mb-4">
          {product.rating && renderStars(product.rating)}
          <span className="text-sm text-gray-600">
            ({product.review_count || 0} reviews)
          </span>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
          {product.featured && <Badge variant="default">Featured</Badge>}
          {product.new && <Badge className="bg-green-500">New</Badge>}
        </div>
      </div>

      {/* Price */}
      <div className="text-2xl font-bold">
        ${selectedVariant?.price || product.price}
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-gray-700">{product.description}</p>
      </div>

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Options</h3>
          <div className="grid grid-cols-2 gap-2">
            {product.variants.map((variant) => (
              <Button
                key={variant.id}
                variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                onClick={() => setSelectedVariant(variant)}
                className="justify-start"
              >
                <div className="text-left">
                  <div className="font-medium">{variant.name}</div>
                  <div className="text-sm opacity-75">
                    {variant.size && `Size: ${variant.size}`}
                    {variant.color && ` Color: ${variant.color}`}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="font-semibold mb-2">Quantity</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button 
          onClick={handleAddToCart} 
          className="w-full"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        
        <Button 
          onClick={handleAddToWishlist}
          variant="outline" 
          className="w-full"
          size="lg"
        >
          <Heart className={`mr-2 h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
          {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </Button>
      </div>

      {/* Product Details */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Product Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Category:</span>
              <span className="ml-2">{product.category.name}</span>
            </div>
            {product.sku && (
              <div>
                <span className="font-medium">SKU:</span>
                <span className="ml-2">{product.sku}</span>
              </div>
            )}
            {product.gender && (
              <div>
                <span className="font-medium">Gender:</span>
                <span className="ml-2 capitalize">{product.gender}</span>
              </div>
            )}
            {selectedVariant?.stock !== undefined && (
              <div>
                <span className="font-medium">Stock:</span>
                <span className="ml-2">{selectedVariant.stock} available</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductInfo;
