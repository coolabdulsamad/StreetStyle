// @/pages/admin/AdminProductNew.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { getProductCategories, getBrands } from '../../lib/services/productService'; // Assuming this path
import { toast } from 'sonner';
import { ProductCategory, Brand } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AdminProductNew = () => {
  const navigate = useNavigate();
  const { isAuthReady, isAdmin } = useAuth();
  const [product, setProduct] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    category_id: '',
    brand_id: '',
    gender: 'unisex', // Default or initial value
    is_new: false,
    featured: false,
    is_limited_edition: false,
    // Add other fields as needed, e.g., initial stock, etc.
  });
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthReady || !isAdmin) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const fetchedCategories = await getProductCategories();
        const fetchedBrands = await getBrands();
        setCategories(fetchedCategories);
        setBrands(fetchedBrands);
      } catch (error) {
        console.error('Error fetching categories/brands:', error);
        toast.error('Failed to load necessary data for new product.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthReady, isAdmin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setProduct((prev) => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setProduct((prev) => ({ ...prev, [id]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProduct((prev) => ({ ...prev, [id]: parseFloat(value) || 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      // Ensure category_id and brand_id are valid UUIDs if your DB expects them
      const categoryId = categories.find(cat => cat.id === product.category_id)?.id || null;
      const brandId = brands.find(b => b.id === product.brand_id)?.id || null;

      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          category_id: categoryId,
          brand_id: brandId,
          gender: product.gender,
          is_new: product.is_new,
          featured: product.featured,
          is_limited_edition: product.is_limited_edition,
          // created_at and updated_at are usually handled by DB defaults
        })
        .select() // Select the inserted row to get its ID
        .single();

      if (error) throw error;

      toast.success('Product created successfully!');
      navigate(`/admin/products/${data.id}`); // Navigate to edit page for the new product
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product.');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isAuthReady) {
    return <div className="flex items-center justify-center min-h-screen">Loading authentication...</div>;
  }

  if (!isAdmin) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Access Denied: You must be an administrator to view this page.</div>;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading form data...</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">Add New Product</h1>
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Enter details for the new product.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" value={product.name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="slug">Product Slug</Label>
                <Input id="slug" value={product.slug} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={product.description} onChange={handleChange} rows={5} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" value={product.price} onChange={handlePriceChange} required />
              </div>
              <div>
                <Label htmlFor="category_id">Category</Label>
                <Select
                  value={product.category_id}
                  onValueChange={(value) => handleSelectChange('category_id', value)}
                  required
                >
                  <SelectTrigger id="category_id">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="brand_id">Brand</Label>
                <Select
                  value={product.brand_id}
                  onValueChange={(value) => handleSelectChange('brand_id', value)}
                  required
                >
                  <SelectTrigger id="brand_id">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_new"
                  checked={product.is_new}
                  onCheckedChange={(checked) => handleSelectChange('is_new', String(checked))}
                />
                <Label htmlFor="is_new">New Arrival</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={product.featured}
                  onCheckedChange={(checked) => handleSelectChange('featured', String(checked))}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_limited_edition"
                  checked={product.is_limited_edition}
                  onCheckedChange={(checked) => handleSelectChange('is_limited_edition', String(checked))}
                />
                <Label htmlFor="is_limited_edition">Limited Edition</Label>
              </div>
            </div>
            {/* Image upload and variant management would go here */}
            <Button type="submit" disabled={isCreating}>
              {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductNew;