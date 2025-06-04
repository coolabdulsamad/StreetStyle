// src/pages/SearchPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { Product } from '@/lib/types';
import { getProducts } from '@/lib/services/productService';
import { toast } from 'sonner';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!queryParam.trim()) {
        setResults([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // --- CORRECTED LINE HERE ---
        const { products } = await getProducts({ searchQuery: queryParam }); // Changed 'query' to 'searchQuery'
        // --- END CORRECTION ---
        setResults(products);
      } catch (err: any) {
        console.error("Error fetching search results:", err);
        toast.error("Failed to load search results.");
        setError(err.message || "An unexpected error occurred while searching.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [queryParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
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

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
            <p className="ml-3 text-lg text-muted-foreground">Searching for products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 border rounded-lg bg-red-50/50 text-red-700">
            <p className="text-xl font-medium mb-4">Error: {error}</p>
            <p className="text-muted-foreground">Please try your search again.</p>
          </div>
        ) : queryParam ? (
          <div>
            <h2 className="text-xl font-medium mb-6">
              Search results for "{queryParam}" ({results.length})
            </h2>
            {results.length > 0 ? (
              <ProductGrid products={results} />
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/30">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-medium mb-4">No results found for "{queryParam}"</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your search terms or explore our categories.
                </p>
                <Link to="/products" className="mt-6 inline-block">
                  <Button>Explore Products</Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/30">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-medium mb-4">Start your search</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Use the search bar above to find products.
            </p>
            <Link to="/products" className="mt-6 inline-block">
              <Button>Explore All Products</Button>
            </Link>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SearchPage;