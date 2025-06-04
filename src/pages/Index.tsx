// @/pages/Index.tsx
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import PageLayout from '@/components/layout/PageLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import TrendingSection from '@/components/products/TrendingSection';
import { Shield, Star, Truck, Clock, Award, Zap, Package } from 'lucide-react'; // Import Package icon

// Import the new product services and Product type
import { getFeaturedProductsService, getNewProductsService } from '../lib/services/productService';
import { Product } from '@/lib/types'; // Make sure this path is correct for your Product type

// Dummy CATEGORIES for display in the categories section.
// If you want to fetch these from Supabase as well, you'd need a similar
// useEffect/useState pattern and a service function for categories.
const CATEGORIES = [
  { id: '1', name: 'Sneakers', slug: 'sneakers' },
  { id: '2', name: 'Hoodies', slug: 'hoodies' },
  { id: '3', name: 'T-Shirts', slug: 't-shirts' },
  { id: '4', name: 'Accessories', slug: 'accessories' },
  { id: '5', name: 'Jackets', slug: 'jackets' },
  { id: '6', name: 'Pants', slug: 'pants' },
];

const Index = () => {
  // Use state to store fetched products and a loading state
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true); // Manages loading for product grids

  useEffect(() => {
    const fetchHomepageProducts = async () => {
      setIsLoadingProducts(true); // Start loading
      try {
        // Fetch featured and new products in parallel
        const [fetchedFeatured, fetchedNew] = await Promise.all([
          getFeaturedProductsService(),
          getNewProductsService()
        ]);
        setFeaturedProducts(fetchedFeatured);
        setNewProducts(fetchedNew);
      } catch (error) {
        console.error("Failed to fetch homepage products:", error);
        // Errors are already toasted in the service, so just set empty arrays
        setFeaturedProducts([]);
        setNewProducts([]);
      } finally {
        setIsLoadingProducts(false); // End loading
      }
    };

    fetchHomepageProducts();
  }, []); // Empty dependency array: runs once on component mount

  return (
    <PageLayout>
      {/* Admin Access Button */}
      <div className="fixed top-20 right-4 z-50">
        <Button asChild variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-gray-50">
          <Link to="/login" state={{ defaultTab: "login", isAdmin: true }}>
            <Shield className="w-4 h-4 mr-2" />
            Admin Login
          </Link>
        </Button>
      </div>

      {/* Hero Section - Redesigned */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3')] bg-cover bg-center opacity-20"></div>

        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <div className="mb-6">
            <Badge variant="outline" className="border-white text-white mb-4 px-4 py-2 text-sm">
              <Zap className="w-4 h-4 mr-2" />
              NEW SEASON DROPS
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            STREET
            <br />
            <span className="text-primary">STYLE</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover exclusive streetwear and limited edition sneakers from top brands.
            Your style, your story, your statement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-4 bg-primary hover:bg-primary/90">
              <Link to="/products/sneakers">
                <Award className="w-5 h-5 mr-2" />
                Shop Sneakers
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 bg-transparent border-white hover:bg-white hover:text-black">
              <Link to="/products/hoodies">
                Shop Streetwear
              </Link>
            </Button>
            {/* NEW: Track Order Button */}
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 bg-transparent border-white hover:bg-white hover:text-black flex items-center gap-2">
              <Link to="/track-order">
                <Package className="h-5 w-5" /> Track Order
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Truck className="w-4 h-4" />
              Free Shipping Over $100
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              24/7 Customer Support
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Star className="w-4 h-4" />
              100% Authentic Products
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-center text-gray-600 text-sm font-medium mb-8 uppercase tracking-wider">
            Trusted by Leading Brands
          </h2>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <div className="text-2xl font-bold">NIKE</div>
            <div className="text-2xl font-bold">ADIDAS</div>
            <div className="text-2xl font-bold">JORDAN</div>
            <div className="text-2xl font-bold">YEEZY</div>
            <div className="text-2xl font-bold">OFF-WHITE</div>
          </div>
        </div>
      </section>

      {/* Categories Section - Enhanced */}
      <section className="py-20 container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Shop by Category</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collections of premium streetwear and exclusive sneakers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Loop through your CATEGORIES (or fetch them from Supabase if preferred) */}
          {CATEGORIES.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              to={`/products/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-gradient-to-br from-gray-900 to-black hover:scale-105 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
                <h3 className="text-2xl font-bold mb-2 group-hover:scale-110 transition-transform">
                  {category.name}
                </h3>
                <p className="text-sm opacity-80 text-center">Discover Latest Drops</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <TrendingSection /> {/* Assuming TrendingSection handles its own data fetching or receives props */}

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Collection</h2>
            <p className="text-xl text-muted-foreground">Handpicked exclusives just for you</p>
          </div>
          {isLoadingProducts ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-pulse text-lg text-gray-600">Loading featured products...</div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">No featured products found.</div>
          )}
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/products">Explore All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">New Arrivals</h2>
          <p className="text-xl text-muted-foreground">Fresh drops, hot styles</p>
        </div>
        {isLoadingProducts ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-lg text-gray-600">Loading new arrivals...</div>
          </div>
        ) : newProducts.length > 0 ? (
          <ProductGrid products={newProducts} />
        ) : (
          <div className="text-center py-12 text-muted-foreground">No new products found.</div>
        )}
      </section>

      {/* Newsletter Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-black via-gray-900 to-black text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Stay Ahead of the Game</h2>
            <p className="text-xl mb-8 text-gray-300">
              Get exclusive access to limited drops, early releases, and insider deals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-400"
              />
              <Button size="lg" className="px-8 py-4">
                Subscribe Now
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Join 50,000+ sneakerheads and style enthusiasts
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
