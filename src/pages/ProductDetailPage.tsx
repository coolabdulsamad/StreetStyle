// src/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // CHANGED: Use useParams from react-router-dom
import PageLayout from '@/components/layout/PageLayout';
import ProductImageGallery from '@/components/products/ProductImageGallery';
import ProductInfo from '@/components/products/ProductInfo';
import ProductReviews from '@/components/products/ProductReviews';
import RelatedProducts from '@/components/products/RelatedProducts';
import { Product } from '@/lib/types';
import { getProduct, getRelatedProducts } from '@/lib/data';

const ProductDetailPage = () => {
  // CHANGED: Use useParams to get the slug directly
  const { slug } = useParams<{ slug: string }>(); // Specify the type for useParams

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // useParams already gives you a string (or undefined), no need for Array.isArray check
    if (!slug) { 
      setIsLoading(false); 
      return;
    }
    
    const fetchProductData = async () => {
      setIsLoading(true);
      try {
        const productData = await getProduct(slug); // Use slug directly
        if (productData) {
          setProduct(productData);
          if (productData.category) {
            const related = await getRelatedProducts(productData.id, productData.category.id);
            setRelatedProducts(related);
          } else {
            setRelatedProducts([]); 
          }
        } else {
          setProduct(null); 
        }
      } catch (error) {
        console.error('Error fetching product or related products:', error);
        setProduct(null); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [slug]); // Keep 'slug' as the dependency for the useEffect

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ProductImageGallery images={product.images.map(img => img.image_url)} productName={product.name} />
          <ProductInfo product={product} />
        </div>
        
        <ProductReviews reviews={product.reviews || []} />
        
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </PageLayout>
  );
};

export default ProductDetailPage;