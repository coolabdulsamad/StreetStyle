
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

type FilterOption = {
  id: string;
  label: string;
}

type FilterProps = {
  onFilterChange: (filters: {
    brands: string[],
    sizes: string[],
    colors: string[],
    types: string[],
    styles: string[],
    priceRange: [number, number]
  }) => void;
  maxPrice: number;
}

const AdvancedFilters: React.FC<FilterProps> = ({ onFilterChange, maxPrice = 300 }) => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  // Sample filter options
  const brands: FilterOption[] = [
    { id: 'nike', label: 'Nike' },
    { id: 'adidas', label: 'Adidas' },
    { id: 'puma', label: 'Puma' },
    { id: 'reebok', label: 'Reebok' },
    { id: 'new-balance', label: 'New Balance' },
    { id: 'vans', label: 'Vans' },
    { id: 'converse', label: 'Converse' },
    { id: 'supreme', label: 'Supreme' },
    { id: 'off-white', label: 'Off-White' },
  ];

  const sizes: FilterOption[] = [
    { id: 'us-7', label: 'US 7' },
    { id: 'us-8', label: 'US 8' },
    { id: 'us-9', label: 'US 9' },
    { id: 'us-10', label: 'US 10' },
    { id: 'us-11', label: 'US 11' },
    { id: 'us-12', label: 'US 12' },
    { id: 'xs', label: 'XS' },
    { id: 's', label: 'S' },
    { id: 'm', label: 'M' },
    { id: 'l', label: 'L' },
    { id: 'xl', label: 'XL' },
  ];

  const colors: FilterOption[] = [
    { id: 'black', label: 'Black' },
    { id: 'white', label: 'White' },
    { id: 'red', label: 'Red' },
    { id: 'blue', label: 'Blue' },
    { id: 'green', label: 'Green' },
    { id: 'yellow', label: 'Yellow' },
    { id: 'multicolor', label: 'Multicolor' },
  ];

  const types: FilterOption[] = [
    { id: 'running', label: 'Running' },
    { id: 'basketball', label: 'Basketball' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'skateboarding', label: 'Skateboarding' },
    { id: 'training', label: 'Training' },
  ];

  const styles: FilterOption[] = [
    { id: 'casual', label: 'Casual' },
    { id: 'oversized', label: 'Oversized' },
    { id: 'athleisure', label: 'Athleisure' },
    { id: 'streetwear', label: 'Streetwear' },
    { id: 'vintage', label: 'Vintage' },
  ];

  const toggleFilter = (id: string, currentSelection: string[], setSelection: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (currentSelection.includes(id)) {
      setSelection(currentSelection.filter(item => item !== id));
    } else {
      setSelection([...currentSelection, id]);
    }
  };

  const applyFilters = () => {
    onFilterChange({
      brands: selectedBrands,
      sizes: selectedSizes,
      colors: selectedColors,
      types: selectedTypes,
      styles: selectedStyles,
      priceRange
    });
  };

  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedTypes([]);
    setSelectedStyles([]);
    setPriceRange([0, maxPrice]);
    onFilterChange({
      brands: [],
      sizes: [],
      colors: [],
      types: [],
      styles: [],
      priceRange: [0, maxPrice]
    });
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  return (
    <div className="space-y-6 max-w-xs">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        <Button variant="outline" size="sm" onClick={resetFilters}>Reset</Button>
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="px-2 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <Slider
                defaultValue={[0, maxPrice]}
                min={0}
                max={maxPrice}
                step={5}
                value={[priceRange[0], priceRange[1]]}
                onValueChange={handlePriceChange}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands">
          <AccordionTrigger>Brands</AccordionTrigger>
          <AccordionContent>
            <div className="px-1 space-y-2 max-h-60 overflow-y-auto">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`brand-${brand.id}`} 
                    checked={selectedBrands.includes(brand.id)}
                    onCheckedChange={() => toggleFilter(brand.id, selectedBrands, setSelectedBrands)}
                  />
                  <Label htmlFor={`brand-${brand.id}`}>{brand.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sizes">
          <AccordionTrigger>Sizes</AccordionTrigger>
          <AccordionContent>
            <div className="px-1 space-y-2 max-h-60 overflow-y-auto">
              {sizes.map((size) => (
                <div key={size.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`size-${size.id}`} 
                    checked={selectedSizes.includes(size.id)}
                    onCheckedChange={() => toggleFilter(size.id, selectedSizes, setSelectedSizes)}
                  />
                  <Label htmlFor={`size-${size.id}`}>{size.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colors">
          <AccordionTrigger>Colors</AccordionTrigger>
          <AccordionContent>
            <div className="px-1 space-y-2 max-h-60 overflow-y-auto">
              {colors.map((color) => (
                <div key={color.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`color-${color.id}`} 
                    checked={selectedColors.includes(color.id)}
                    onCheckedChange={() => toggleFilter(color.id, selectedColors, setSelectedColors)}
                  />
                  <Label htmlFor={`color-${color.id}`}>{color.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="types">
          <AccordionTrigger>Sneaker Types</AccordionTrigger>
          <AccordionContent>
            <div className="px-1 space-y-2 max-h-60 overflow-y-auto">
              {types.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`type-${type.id}`} 
                    checked={selectedTypes.includes(type.id)}
                    onCheckedChange={() => toggleFilter(type.id, selectedTypes, setSelectedTypes)}
                  />
                  <Label htmlFor={`type-${type.id}`}>{type.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="styles">
          <AccordionTrigger>Clothing Styles</AccordionTrigger>
          <AccordionContent>
            <div className="px-1 space-y-2 max-h-60 overflow-y-auto">
              {styles.map((style) => (
                <div key={style.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`style-${style.id}`} 
                    checked={selectedStyles.includes(style.id)}
                    onCheckedChange={() => toggleFilter(style.id, selectedStyles, setSelectedStyles)}
                  />
                  <Label htmlFor={`style-${style.id}`}>{style.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
    </div>
  );
};

export default AdvancedFilters;
