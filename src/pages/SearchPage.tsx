
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Product } from '@/types/product';
import { searchProducts } from '@/data/products';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (queryParam) {
      const searchResults = searchProducts(queryParam);
      setResults(searchResults);
    }
  }, [queryParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  return (
    <PageLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Search Products</h1>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search for products, brands, and more..."
              className="pr-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </form>
        
        {queryParam ? (
          <div>
            <h2 className="text-xl font-medium mb-6">
              Search results for "{queryParam}" ({results.length})
            </h2>
            <ProductGrid products={results} />
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Enter a search query to find products
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SearchPage;
