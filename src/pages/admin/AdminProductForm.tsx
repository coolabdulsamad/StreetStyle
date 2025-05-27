
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '@/data/products';

// Define the form validation schema
const productFormSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required'),
  is_new: z.boolean().optional(),
  is_sale: z.boolean().optional(),
  is_limited: z.boolean().optional(),
  stock_quantity: z.coerce.number().min(0, 'Stock must be 0 or positive'),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface AdminProductFormProps {
  productId?: string;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({ productId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<any | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const isEditMode = !!productId;
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      category: '',
      brand: '',
      is_new: false,
      is_sale: false,
      is_limited: false,
      stock_quantity: 0,
    },
  });
  
  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode && productId) {
      const fetchProduct = async () => {
        setIsLoading(true);
        
        try {
          // Find product from mock data
          const productData = PRODUCTS.find(p => p.id === productId);
          
          if (productData) {
            setProduct(productData);
            setImageUrls(productData.images);
            
            // Set form values with the correct property mappings
            form.reset({
              name: productData.name || '',
              slug: productData.slug || '',
              description: productData.description || '',
              price: productData.price || 0,
              category: productData.category.slug || '',
              brand: productData.brand || '',
              is_new: productData.new || false,
              is_sale: productData.is_sale || false,
              is_limited: productData.is_limited || false,
              stock_quantity: productData.stock_quantity || 0,
            });
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          toast.error('Failed to load product details');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [isEditMode, productId, form]);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prevFiles => [...prevFiles, ...files]);
    
    // Create preview URLs for the new images
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    setImageUrls(prevUrls => [...prevUrls, ...newImageUrls]);
  };
  
  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    
    try {
      // Generate a new slug if one wasn't provided
      if (!data.slug) {
        data.slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      }
      
      // For now, just show success message since we're using mock data
      if (isEditMode) {
        toast.success('Product updated successfully');
      } else {
        toast.success('Product created successfully');
      }
      
      // Navigate back to product list
      navigate('/admin');
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(`Failed to save product: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="product-slug" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL-friendly name (auto-generated if left empty)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="99.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map(category => (
                          <SelectItem key={category.id} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Brand name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Product description" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <FormLabel>Product Images</FormLabel>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="is_new"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">New Product</FormLabel>
                      <FormDescription>
                        Mark as new arrival
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_sale"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">On Sale</FormLabel>
                      <FormDescription>
                        Mark as sale item
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_limited"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Limited Edition</FormLabel>
                      <FormDescription>
                        Mark as limited edition
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AdminProductForm;
