import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/layout/PageLayout';
import ProductGrid from '@/components/products/ProductGrid';
import FilterSidebar from '@/components/products/FilterSidebar';
import { Product, Category, ProductTag } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Filter, X, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client'; // Assuming this path to your Supabase client
import { mapProductData } from '@/lib/data'; // Import mapProductData here!

const ProductListPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  // --- Data Fetching with react-query ---

  // 1. Fetch all products (to apply filters later)
  const { data: allProducts, isLoading: isLoadingProducts, error: productsError } = useQuery<Product[]>({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      // Fetch products along with their brand, category, tags, and images
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          category:product_categories(*),
          tags:products_tags(tag:tags(*)),
          images:product_images(*)
        `)
        .eq('is_sale', true); // Only fetch active products

      if (error) throw new Error(error.message);

      // Apply the mapProductData helper from src/lib/data.ts here!
      const mappedData = data.map(mapProductData);

      // console.log('DEBUG: ProductListPage fetched and mapped products before setting state:', mappedData); // Debug log
      return mappedData as Product[];
    },
  });

  // 2. Fetch all categories (for the filter sidebar)
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (error) throw new Error(error.message);
      return data as Category[];
    },
  });

  // 3. Fetch all tags (for the filter sidebar)
  const { data: tags, isLoading: isLoadingTags, error: tagsError } = useQuery<ProductTag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*');
      if (error) throw new Error(error.message);
      return data as ProductTag[];
    },
  });

  const allTags = tags || []; // Ensure allTags is always an array
  const allCategories = categories || []; // Ensure allCategories is always an array

  // Calculate max price from fetched products
  const currentMaxPrice = allProducts ? Math.max(...allProducts.map(product => product.price)) : 1000;

  useEffect(() => {
    // Set initial category from URL slug
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    } else {
      setSelectedCategory(null);
    }
    // Also, reset price range to max price based on fetched products
    // This effect runs after products are fetched and currentMaxPrice is stable
    if (allProducts) {
      setPriceRange([0, currentMaxPrice]);
    }
  }, [categorySlug, allProducts, currentMaxPrice]); // Add allProducts and currentMaxPrice to dependency array

  useEffect(() => {
    if (!allProducts) return; // Wait until products are loaded

    let result = [...allProducts];

    // Filter by category
    if (selectedCategory) {
      result = result.filter(product => product.category?.slug === selectedCategory); // Added optional chaining for safety
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
  }, [selectedCategory, selectedTags, priceRange, allProducts]); // Add allProducts to dependency array

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    // When category changes, clear other filters
    setSelectedTags([]);
    setPriceRange([0, currentMaxPrice]);
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
    setPriceRange([0, currentMaxPrice]);
    setSelectedCategory(categorySlug || null); // Reset category based on URL
  };

  const getCategoryName = () => {
    if (!selectedCategory) return 'All Products';
    const category = allCategories.find(c => c.slug === selectedCategory);
    return category ? category.name : 'Products';
  };

  // --- Loading and Error States ---
  if (isLoadingProducts || isLoadingCategories || isLoadingTags) {
    return (
      <PageLayout>
        <div className="container py-12 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-lg">Loading products...</p>
        </div>
      </PageLayout>
    );
  }

  if (productsError || categoriesError || tagsError) {
    console.error("Error fetching data:", productsError || categoriesError || tagsError);
    return (
      <PageLayout>
        <div className="container py-12 text-center text-red-500">
          <p className="text-xl font-semibold">Error loading products.</p>
          <p className="mt-2 text-muted-foreground">Please try again later. {productsError?.message || categoriesError?.message || tagsError?.message}</p>
        </div>
      </PageLayout>
    );
  }

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
                  categories={allCategories}
                  tags={allTags}
                  selectedCategory={selectedCategory}
                  selectedTags={selectedTags}
                  priceRange={priceRange}
                  maxPrice={currentMaxPrice}
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
              categories={allCategories}
              tags={allTags}
              selectedCategory={selectedCategory}
              selectedTags={selectedTags}
              priceRange={priceRange}
              maxPrice={currentMaxPrice}
              onCategoryChange={handleCategoryChange}
              onTagChange={handleTagChange}
              onPriceChange={handlePriceChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Product grid */}
          <div className="flex-1">
            <div className="mb-4 flex flex-wrap gap-2">
              {/* Displaying selected tags (from the fetched tags) */}
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