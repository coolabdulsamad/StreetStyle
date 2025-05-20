
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ProductGrid from '@/components/products/ProductGrid';
import FilterSidebar from '@/components/products/FilterSidebar';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { ProductTag, Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const ProductListPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 250]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get all unique tags from products
  const allTags: ProductTag[] = Array.from(
    new Set(
      PRODUCTS.flatMap(product => product.tags).map(tag => JSON.stringify(tag))
    )
  ).map(tag => JSON.parse(tag));

  // Find max price
  const maxPrice = Math.max(...PRODUCTS.map(product => product.price));

  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    } else {
      setSelectedCategory(null);
    }
  }, [categorySlug]);

  useEffect(() => {
    // Apply filters
    let result = [...PRODUCTS];
    
    // Filter by category
    if (selectedCategory) {
      result = result.filter(product => product.category.slug === selectedCategory);
    }
    
    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter(product => 
        product.tags.some(tag => selectedTags.includes(tag.id))
      );
    }
    
    // Filter by price range
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    setFilteredProducts(result);
  }, [selectedCategory, selectedTags, priceRange]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleTagChange = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setPriceRange([0, maxPrice]);
    setSelectedCategory(categorySlug || null);
  };

  const getCategoryName = () => {
    if (!selectedCategory) return 'All Products';
    const category = CATEGORIES.find(c => c.slug === selectedCategory);
    return category ? category.name : 'Products';
  };

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{getCategoryName()}</h1>
          
          {/* Mobile filter button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="py-4">
                <FilterSidebar
                  categories={CATEGORIES}
                  tags={allTags}
                  selectedCategory={selectedCategory}
                  selectedTags={selectedTags}
                  priceRange={priceRange}
                  maxPrice={maxPrice}
                  onCategoryChange={handleCategoryChange}
                  onTagChange={handleTagChange}
                  onPriceChange={handlePriceChange}
                  onClearFilters={clearFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar for desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              categories={CATEGORIES}
              tags={allTags}
              selectedCategory={selectedCategory}
              selectedTags={selectedTags}
              priceRange={priceRange}
              maxPrice={maxPrice}
              onCategoryChange={handleCategoryChange}
              onTagChange={handleTagChange}
              onPriceChange={handlePriceChange}
              onClearFilters={clearFilters}
            />
          </div>
          
          {/* Product grid */}
          <div className="flex-1">
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedTags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedTags.map(tagId => {
                    const tag = allTags.find(t => t.id === tagId);
                    return tag ? (
                      <div 
                        key={tag.id} 
                        className="bg-secondary px-3 py-1 rounded-full flex items-center gap-1"
                      >
                        <span>{tag.name}</span>
                        <button 
                          onClick={() => handleTagChange(tag.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : null;
                  })}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedTags([])}
                    className="h-7"
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
            
            <ProductGrid products={filteredProducts} itemsPerPage={12} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductListPage;
