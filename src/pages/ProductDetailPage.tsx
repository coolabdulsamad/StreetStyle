
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { getProductBySlug } from '@/data/products';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart } from 'lucide-react';
import { ProductVariant } from '@/types/product';
import { useCart } from '@/contexts/CartContext';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  
  const product = slug ? getProductBySlug(slug) : undefined;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <PageLayout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </PageLayout>
    );
  }

  const handleVariantChange = (variantId: string) => {
    const variant = product.variants.find(v => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product, selectedVariant, quantity);
    }
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Group variants by color
  const colorOptions = Array.from(new Set(product.variants.map(v => v.color)));
  
  // Filter size options based on selected color
  const sizeOptions = selectedVariant?.color 
    ? product.variants
        .filter(v => v.color === selectedVariant.color)
        .map(v => v.size)
    : [];

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square overflow-hidden rounded-md">
                      <img
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-2 text-muted-foreground">{product.category.name}</div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* Price */}
            <div className="text-2xl font-bold mb-4">
              ${selectedVariant?.price || product.price}
            </div>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={star <= Math.floor(product.rating) ? "currentColor" : "none"}
                      stroke="currentColor"
                      className={`w-5 h-5 ${
                        star <= Math.floor(product.rating) ? "text-yellow-500" : "text-gray-300"
                      }`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">
                  {product.rating} ({product.reviews?.length || 0} reviews)
                </span>
              </div>
            )}

            {/* Description */}
            <p className="mb-6 text-muted-foreground">{product.description}</p>
            
            {/* Variants */}
            <div className="space-y-6">
              {/* Color selection */}
              {colorOptions.length > 1 && (
                <div>
                  <h3 className="font-medium mb-2">Color</h3>
                  <RadioGroup
                    value={selectedVariant?.color}
                    onValueChange={(value) => {
                      const newVariant = product.variants.find(v => v.color === value);
                      if (newVariant) setSelectedVariant(newVariant);
                    }}
                    className="flex gap-2"
                  >
                    {colorOptions.map((color) => (
                      <div key={color} className="flex items-center space-x-2">
                        <RadioGroupItem value={color || ''} id={`color-${color}`} />
                        <Label htmlFor={`color-${color}`}>{color}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Size selection */}
              {sizeOptions.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Size</h3>
                  <RadioGroup
                    value={selectedVariant?.size}
                    onValueChange={(value) => {
                      const newVariant = product.variants.find(
                        v => v.size === value && v.color === selectedVariant?.color
                      );
                      if (newVariant) setSelectedVariant(newVariant);
                    }}
                    className="flex flex-wrap gap-2"
                  >
                    {sizeOptions.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <RadioGroupItem value={size || ''} id={`size-${size}`} />
                        <Label htmlFor={`size-${size}`}>{size}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="font-medium mb-2">Quantity</h3>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Stock indicator */}
              {selectedVariant && (
                <div className="text-sm">
                  {selectedVariant.stock > 0 ? (
                    <span className="text-green-600">
                      In Stock ({selectedVariant.stock} available)
                    </span>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )}
                </div>
              )}

              {/* Add to cart and wishlist buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAddToCart} 
                  disabled={!selectedVariant || selectedVariant.stock <= 0}
                  className="flex-1"
                  size="lg"
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlistToggle}
                  className="flex items-center justify-center gap-2"
                >
                  <Heart className={inWishlist ? "fill-primary text-primary" : ""} />
                  {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>

              {/* Product tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground mb-1">Tags:</div>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map(tag => (
                      <span 
                        key={tag.id}
                        className="bg-secondary px-2 py-1 rounded-md text-xs"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductDetailPage;
