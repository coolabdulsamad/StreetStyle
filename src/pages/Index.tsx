
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { CATEGORIES, getFeaturedProducts, getNewProducts } from '@/data/products';
import { Link } from 'react-router-dom';

const Index = () => {
  const featuredProducts = getFeaturedProducts();
  const newProducts = getNewProducts();

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative">
        <div className="relative bg-brand-dark">
          <img 
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Hero" 
            className="w-full h-[70vh] md:h-[80vh] object-cover opacity-70"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">Premium Streetwear & Sneakers</h1>
            <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl">
              Discover the latest drops from top brands and exclusive collections
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="text-lg">
                <Link to="/products/sneakers">Shop Sneakers</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg bg-transparent border-white hover:bg-white hover:text-black">
                <Link to="/products/hoodies">Shop Clothing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 container">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((category) => (
            <Link 
              key={category.id} 
              to={`/products/${category.slug}`}
              className="relative overflow-hidden rounded-lg aspect-square group"
            >
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-colors flex items-center justify-center">
                <h3 className="text-white text-xl font-bold">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <ProductGrid products={featuredProducts} title="Featured Products" />
          <div className="mt-8 text-center">
            <Button asChild>
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 container">
        <ProductGrid products={newProducts} title="New Arrivals" />
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-brand-dark text-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="mb-6">Subscribe to our newsletter for exclusive offers and early access to new drops</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white/10"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
