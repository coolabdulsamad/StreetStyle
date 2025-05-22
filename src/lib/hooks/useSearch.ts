
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ExtendedProduct } from "@/lib/types";
import { getProducts } from "@/lib/services/productService";
import { useDebouncedCallback } from "@/lib/hooks/useDebounce";

export function useSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [searchResults, setSearchResults] = useState<ExtendedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  // Create a debounced search function
  const debouncedSearch = useDebouncedCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      setTotalCount(0);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { products, count } = await getProducts({ 
        searchQuery,
        limit: 10
      });
      
      setSearchResults(products);
      setTotalCount(count);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, 300);
  
  // Effect to trigger search when query changes
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);
  
  // Handle search query change
  const handleSearchChange = (value: string) => {
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };
  
  // Handle search submission
  const handleSearchSubmit = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  
  return {
    query,
    searchResults,
    isLoading,
    totalCount,
    handleSearchChange,
    handleSearchSubmit
  };
}
