import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ProductTag } from '@/lib/types';
import { Slider } from '@/components/ui/slider';

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
  formatPrice: (price: number) => string;
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
  onClearFilters,
  formatPrice
}) => {
  const handlePriceRangeChange = (values: number[]) => {
    onPriceChange([values[0], values[1]]);
  };

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
        <div className="space-y-2 max-h-48 overflow-y-auto">
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
          <div className="flex justify-between">
            <span className="text-sm font-medium">{formatPrice(priceRange[0])}</span>
            <span className="text-sm font-medium">{formatPrice(priceRange[1])}</span>
          </div>
          <Slider
            defaultValue={[priceRange[0], priceRange[1]]}
            min={0}
            max={maxPrice}
            step={5}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={handlePriceRangeChange}
            className="w-full"
          />
        </div>
      </div>

      <Button onClick={onClearFilters} variant="outline" className="w-full">
        Clear Filters
      </Button>
    </div>
  );
};

export default FilterSidebar;
