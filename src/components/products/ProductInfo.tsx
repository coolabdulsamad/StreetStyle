import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Ruler } from 'lucide-react';
import { Product, ProductVariant } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Shadcn UI Dialog components for the Size Guide
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Assuming you have this utility for conditional class names
import { cn } from '@/lib/utils';

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const hasVariants = product.variants && product.variants.length > 0;

  // --- DEBUG LOGS START ---
  console.log('ProductInfo: Product received:', product);
  console.log('ProductInfo: hasVariants:', hasVariants);
  if (hasVariants) {
    console.log('ProductInfo: Raw variants data:', product.variants);
    console.log('ProductInfo: First variant color:', product.variants![0]?.color);
    console.log('ProductInfo: First variant color_hex:', product.variants![0]?.color_hex);
  }
  // --- DEBUG LOGS END ---

  // State to track the user's selected color and size
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    hasVariants && product.variants![0]?.color ? product.variants![0].color : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    hasVariants && product.variants![0]?.size ? product.variants![0].size : undefined
  );

  // State to hold the currently active variant based on selected color and size
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    hasVariants ? product.variants![0] : undefined
  );

  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user } = useAuth();

  // Extract unique colors and sizes from all product variants for display
  const uniqueColors = hasVariants
    ? Array.from(new Set(product.variants!.map(v => v.color).filter(Boolean) as string[]))
    : [];
  const uniqueSizes = hasVariants
    ? Array.from(new Set(product.variants!.map(v => v.size).filter(Boolean) as string[]))
    : [];

  // --- DEBUG LOGS START ---
  console.log('ProductInfo: Unique Colors for display:', uniqueColors);
  console.log('ProductInfo: Unique Sizes for display:', uniqueSizes);
  // --- DEBUG LOGS END ---

  // Effect to update selectedVariant whenever selectedColor or selectedSize changes
  useEffect(() => {
    if (hasVariants) {
      const foundVariant = product.variants!.find(
        v =>
          (selectedColor ? v.color === selectedColor : true) &&
          (selectedSize ? v.size === selectedSize : true)
      );
      setSelectedVariant(foundVariant);
    }
  }, [selectedColor, selectedSize, product.variants, hasVariants]);


  const handleAddToCart = () => {
    if (hasVariants) {
      if (uniqueColors.length > 0 && !selectedColor) {
        toast.error('Please select a color.');
        return;
      }
      if (uniqueSizes.length > 0 && !selectedSize) {
        toast.error('Please select a size.');
        return;
      }
      if (!selectedVariant) {
        toast.error('Selected combination is out of stock or invalid.');
        return;
      }
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

  // Helper function to get the hex code for a given color name from variants
  const getColorHex = (colorName: string): string => {
    const variant = product.variants?.find(v => v.color === colorName && v.color_hex);
    return variant?.color_hex || '#CCCCCC';
  };

  return (
    <div className="space-y-6">
      {/* Product Title & Badges */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {product.new && <Badge variant="secondary">New</Badge>}
          {product.featured && <Badge>Featured</Badge>}
          {product.is_limited_edition && <Badge variant="destructive">Limited Edition</Badge>}
          {product.brand && <Badge variant="outline">{product.brand.name}</Badge>}
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
          ${hasVariants && selectedVariant ? selectedVariant.price : product.price}
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
            <span>{product.category?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Brand:</span>
            <span>{product.brand?.name || 'N/A'}</span>
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

      {/* Color Selection - ONLY RENDER IF VARIANTS EXIST AND HAVE COLORS */}
      {hasVariants && uniqueColors.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Select Color:</h3>
          <div className="flex flex-wrap gap-2">
            {uniqueColors.map(color => (
              <Button
                key={color}
                variant="outline"
                size="icon"
                className={cn(
                  "relative w-8 h-8 rounded-full border-2",
                  selectedColor === color ? "ring-2 ring-offset-2 ring-primary" : "hover:ring-1 hover:ring-offset-1 hover:ring-gray-300"
                )}
                style={{ backgroundColor: getColorHex(color) }}
                onClick={() => {
                  setSelectedColor(color);
                  const sizesForNewColor = product.variants!
                    .filter(v => v.color === color)
                    .map(v => v.size);
                  if (selectedSize && !sizesForNewColor.includes(selectedSize)) {
                    setSelectedSize(undefined);
                  }
                }}
              >
                {selectedColor === color && (
                  <span className="absolute inset-0 flex items-center justify-center text-white">✓</span>
                )}
                <span className="sr-only">{color}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection - ONLY RENDER IF VARIANTS EXIST */}
      {hasVariants && uniqueSizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Select Size:</h3>
            {/* Size Guide Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-primary">
                  <Ruler className="w-4 h-4 mr-1" />
                  Size Guide
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Size Guide</DialogTitle>
                  <DialogDescription>
                    Find your perfect fit with our comprehensive size chart.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <img src="/placeholder-size-chart.png" alt="Size Chart" className="w-full h-auto" />
                  <p className="text-sm text-muted-foreground mt-4">
                    Measurements are approximate. Please refer to specific product details for more accuracy.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {uniqueSizes
              .filter(size =>
                !selectedColor || product.variants!.some(v => v.color === selectedColor && v.size === size)
              )
              .map((size) => {
                const variantForSize = product.variants!.find(
                  v => v.size === size && (selectedColor ? v.color === selectedColor : true)
                );
                const isOutOfStock = variantForSize ? variantForSize.stock === 0 : true;

                return (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className="text-sm"
                    disabled={isOutOfStock}
                  >
                    {size} {isOutOfStock && '(Out)'}
                  </Button>
                );
              })}
          </div>
          {selectedVariant && (
            <p className="text-sm text-muted-foreground">
              Price: ₦{selectedVariant.price} • Stock: {selectedVariant.stock} available
            </p>
          )}
          {hasVariants && uniqueColors.length > 0 && !selectedColor && (
            <p className="text-sm text-red-500">Please select a color.</p>
          )}
          {hasVariants && uniqueSizes.length > 0 && selectedColor && !selectedSize && (
            <p className="text-sm text-red-500">Please select a size.</p>
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
            disabled={
              product.stock_quantity === 0 ||
              (hasVariants && (
                !selectedVariant ||
                selectedVariant.stock === 0 ||
                (uniqueColors.length > 0 && !selectedColor) ||
                (uniqueSizes.length > 0 && !selectedSize)
              ))
            }
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {
              product.stock_quantity === 0 ? 'Out of Stock' :
              (hasVariants && (uniqueColors.length > 0 && !selectedColor)) ? 'Select Color' :
              (hasVariants && (uniqueSizes.length > 0 && !selectedSize)) ? 'Select Size' :
              (hasVariants && (!selectedVariant || selectedVariant.stock === 0)) ? 'Selected Out of Stock' :
              'Add to Cart'
            }
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