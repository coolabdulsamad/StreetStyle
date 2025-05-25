
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { ExtendedProduct } from '@/lib/types';
import { getProductBySlug } from '@/lib/services/productService';
import { formatPrice } from '@/lib/utils';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import SizeGuideModal from '@/components/products/SizeGuideModal';
import ProductReviews from '@/components/products/ProductReviews';
import StyleInspirationSection from '@/components/products/StyleInspirationSection';

interface Params extends Record<string, string | undefined> {
  slug?: string;
}

const ProductDetailPage = () => {
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { slug } = useParams<Params>();
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      const productData = await getProductBySlug(slug);
      setProduct(productData);
      if (productData && productData.images.length > 0) {
        setSelectedImage(productData.images[0]);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  if (!product) {
    return <PageLayout><div>Loading...</div></PageLayout>;
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.info("Please log in to add items to your cart", {
        action: {
          label: "Login",
          onClick: () => navigate('/login'),
        },
      });
      return;
    }
    
    if (selectedVariant) {
      addToCart(product, selectedVariant, quantity);
    } else {
      // Use default variant if none selected
      const defaultVariant = {
        id: 'default',
        name: 'Default',
        price: product.price,
        stock: 100
      };
      addToCart(product, defaultVariant, quantity);
    }
  };

  const handleAddToWishlist = () => {
    if (!user) {
      toast.info("Please log in to add items to your wishlist", {
        action: {
          label: "Login",
          onClick: () => navigate('/login'),
        },
      });
      return;
    }
    
    addToWishlist(product);
  };

  const isProductInWishlist = isInWishlist(product.id);
  
  // Determine product type for size guide
  const getProductType = (): 'footwear' | 'clothing' | 'accessories' => {
    const category = product.category?.slug || '';
    if (category === 'sneakers') return 'footwear';
    if (['t-shirts', 'hoodies', 'pants'].includes(category)) return 'clothing';
    return 'accessories';
  };

  return (
    <PageLayout>
      <div className="container py-12">
        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`w-20 h-20 rounded overflow-hidden flex-shrink-0 border-2 ${
                      selectedImage === image ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* Category & Tags */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">{product.category?.name}</span>
              {product.tags && product.tags.length > 0 && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.slice(0, 3).map((tag) => (
                      <span key={tag.id} className="text-xs bg-muted px-2 py-1 rounded-full">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Price */}
            <div className="mb-6">
              <span className="text-2xl font-bold">
                {formatPrice(selectedVariant?.price || product.price)}
              </span>
              {product.variants && product.variants.length > 1 && selectedVariant && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {selectedVariant.name}
                </span>
              )}
            </div>

            {/* Variant Selection */}
            {product.variants && product.variants.length > 1 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="variants" className="text-sm font-medium">
                    Select Variant:
                  </Label>
                  <SizeGuideModal productType={getProductType()} />
                </div>
                <RadioGroup defaultValue={selectedVariant?.id} className="mt-2">
                  <div className="grid grid-cols-3 gap-3">
                    {product.variants.map((variant) => (
                      <div key={variant.id} className="space-y-0.5">
                        <RadioGroupItem value={variant.id} id={variant.id} className="aspect-square h-8 w-8 rounded-full bg-muted text-muted-foreground shadow-sm" onClick={() => setSelectedVariant(variant)} />
                        <Label htmlFor={variant.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {variant.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="mb-6">
              <Label htmlFor="quantity" className="block text-sm font-medium mb-2">
                Quantity:
              </Label>
              <div className="flex items-center max-w-[150px]">
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 rounded-r-none"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  <span className="sr-only">Decrease</span>
                  <span className="text-xl">-</span>
                </Button>
                <Input
                  type="number"
                  id="quantity"
                  className="h-9 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                />
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 rounded-l-none"
                  onClick={() => setQuantity(q => q + 1)}
                >
                  <span className="sr-only">Increase</span>
                  <span className="text-xl">+</span>
                </Button>
              </div>
            </div>

            {/* Product Status */}
            {selectedVariant && (
              <div className="mb-6">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${selectedVariant.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm">
                    {selectedVariant.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                onClick={handleAddToCart}
                disabled={selectedVariant?.stock === 0}
              >
                Add to Cart
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleAddToWishlist}>
                <Heart className="mr-2 h-4 w-4" />
                {isProductInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Additional Product Information */}
        <div className="mb-16">
          <Tabs defaultValue="details">
            <TabsList className="w-full justify-start border-b rounded-none">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-6">
              <div className="prose max-w-none">
                <h3>Product Details</h3>
                <ul>
                  <li>Category: {product.category?.name}</li>
                  <li>Material: Premium quality materials</li>
                  <li>Style: Contemporary streetwear</li>
                  {product.tags && product.tags.length > 0 && (
                    <li>Tags: {product.tags.map(tag => tag.name).join(', ')}</li>
                  )}
                </ul>
                
                <h3>Care Instructions</h3>
                <p>
                  To keep your product looking its best, we recommend:
                </p>
                <ul>
                  <li>Clean with a damp cloth</li>
                  <li>Air dry only</li>
                  <li>Store in a cool, dry place</li>
                  <li>Avoid direct sunlight for extended periods</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-6">
              <ProductReviews 
                reviews={product.reviews || []}
                productId={product.id}
              />
            </TabsContent>
            
            <TabsContent value="shipping" className="pt-6">
              <div className="prose max-w-none">
                <h3>Shipping Information</h3>
                <p>
                  We offer the following shipping options:
                </p>
                <ul>
                  <li>Standard Shipping (3-5 business days): $5.99</li>
                  <li>Express Shipping (1-2 business days): $12.99</li>
                  <li>Free shipping on orders over $100</li>
                </ul>
                
                <h3>Returns & Exchanges</h3>
                <p>
                  Not happy with your purchase? No problem! We offer a 30-day return policy.
                </p>
                <ul>
                  <li>Items must be unused with original tags attached</li>
                  <li>Shipping costs are non-refundable</li>
                  <li>For exchanges, please contact our customer service team</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Style Inspiration Section */}
        <StyleInspirationSection />
      </div>
    </PageLayout>
  );
};

export default ProductDetailPage;
