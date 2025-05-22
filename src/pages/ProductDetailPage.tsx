
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Product, ProductVariant } from '@/types/product';
import { getProduct } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Heart } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

interface Params extends Record<string, string | undefined> {
  slug?: string;
}

const ProductDetailPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { slug } = useParams<Params>();
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      const productData = await getProduct(slug);
      setProduct(productData);
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product && product.variants.length > 0) {
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
      toast.error("Please select a variant");
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

  return (
    <PageLayout>
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-auto rounded-lg"
              style={{ maxHeight: '600px', objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Price */}
            <div className="mb-4">
              <span className="font-bold text-xl">Price:</span>
              <span className="text-xl ml-2">{formatPrice(selectedVariant?.price || product.variants[0]?.price)}</span>
            </div>

            {/* Variant Selection */}
            {product.variants.length > 1 && (
              <div className="mb-6">
                <Label htmlFor="variants" className="block text-sm font-medium text-gray-700">
                  Select Variant:
                </Label>
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
              <Label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity:
              </Label>
              <div className="mt-2">
                <Input
                  type="number"
                  id="quantity"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-24 sm:text-sm border-gray-300 rounded-md"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  min="1"
                />
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-2">
              <Button className="w-full" onClick={handleAddToCart}>Add to Cart</Button>
              <Button variant="outline" className="w-full" onClick={handleAddToWishlist}>
                <Heart className="mr-2 h-4 w-4" />
                {isProductInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductDetailPage;
