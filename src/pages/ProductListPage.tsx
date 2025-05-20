
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { PRODUCTS, CATEGORIES, getProductsByCategory } from '@/data/products';

const ProductListPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [products, setProducts] = useState(PRODUCTS);
  const [category, setCategory] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (categorySlug) {
      const categoryProducts = getProductsByCategory(categorySlug);
      setProducts(categoryProducts);
      
      const currentCategory = CATEGORIES.find(c => c.slug === categorySlug);
      setCategory(currentCategory?.name);
    } else {
      setProducts(PRODUCTS);
      setCategory(undefined);
    }
  }, [categorySlug]);

  return (
    <PageLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">{category || 'All Products'}</h1>
        
        <ProductGrid products={products} />
      </div>
    </PageLayout>
  );
};

export default ProductListPage;
