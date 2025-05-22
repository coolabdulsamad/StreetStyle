
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, X } from 'lucide-react';
import { searchProducts } from '@/lib/data';
import { Product } from '@/types/product';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await searchProducts(query);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (query.trim()) {
      searchTimeout.current = setTimeout(() => {
        handleSearch();
      }, 300);
    } else {
      setResults([]);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setOpen(false);
    }
  };

  const handleSelectItem = (product: Product) => {
    navigate(`/product/${product.slug}`);
    setOpen(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <form onSubmit={handleSubmit} className="relative flex w-full">
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search products, brands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-8"
                onFocus={() => setOpen(true)}
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-12 flex items-center pr-1"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
              <Button type="submit" size="icon" className="ml-2">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </form>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <Command>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Search products, brands..."
              className="border-none focus:ring-0"
            />
            <CommandList>
              {isLoading ? (
                <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                  Searching...
                </div>
              ) : (
                <>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {results.length > 0 && (
                    <CommandGroup heading="Products">
                      {results.slice(0, 5).map((product) => (
                        <CommandItem
                          key={product.id}
                          onSelect={() => handleSelectItem(product)}
                          className="flex items-center gap-2 p-2"
                        >
                          <div className="h-10 w-10 overflow-hidden rounded-md border">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{product.name}</h4>
                            <p className="text-xs text-muted-foreground">{product.category.name}</p>
                          </div>
                          <div className="text-sm font-medium">${product.price}</div>
                        </CommandItem>
                      ))}
                      {results.length > 5 && (
                        <div className="p-2 text-center">
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => {
                              navigate(`/search?q=${encodeURIComponent(query)}`);
                              setOpen(false);
                            }}
                          >
                            View all {results.length} results
                          </Button>
                        </div>
                      )}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchBar;
