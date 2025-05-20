
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ProductTag } from '@/types/product';

interface FilterSidebarProps {
  categories: { id: string; name: string; slug: string }[];
  tags: ProductTag[];
  selectedCategory: string | null;
  selectedTags: string[];
  priceRange: [number, number];
  maxPrice: number;
  onCategoryChange: (category: string | null) => void;
  onTagChange: (tag: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  tags,
  selectedCategory,
  selectedTags,
  priceRange,
  maxPrice,
  onCategoryChange,
  onTagChange,
  onPriceChange,
  onClearFilters
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-lg mb-3">Categories</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="all-categories" 
              checked={selectedCategory === null}
              onCheckedChange={() => onCategoryChange(null)}
            />
            <Label htmlFor="all-categories">All Categories</Label>
          </div>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category.id}`} 
                checked={selectedCategory === category.slug}
                onCheckedChange={() => onCategoryChange(category.slug)}
              />
              <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-lg mb-3">Tags</h3>
        <div className="space-y-2">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`tag-${tag.id}`} 
                checked={selectedTags.includes(tag.id)}
                onCheckedChange={() => onTagChange(tag.id)}
              />
              <Label htmlFor={`tag-${tag.id}`}>{tag.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-lg mb-3">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <div className="flex space-x-2">
            <input
              type="range"
              min="0"
              max={maxPrice}
              value={priceRange[0]}
              onChange={(e) => onPriceChange([parseInt(e.target.value), priceRange[1]])}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <Button onClick={onClearFilters} variant="outline" className="w-full">
        Clear Filters
      </Button>
    </div>
  );
};

export default FilterSidebar;
