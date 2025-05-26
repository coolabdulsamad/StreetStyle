
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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Product, ProductCategory, Brand, Gender } from '@/lib/types';

// Define the form validation schema
const productFormSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be a positive number'),
  category_id: z.string().min(1, 'Category is required'),
  brand_id: z.string().min(1, 'Brand is required'),
  sku: z.string().optional(),
  gender: z.enum(['men', 'women', 'unisex', 'kids']).optional(),
  is_new: z.boolean().optional(),
  featured: z.boolean().optional(),
  is_limited_edition: z.boolean().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface AdminProductFormProps {
  productId?: string;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({ productId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
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
      category_id: '',
      brand_id: '',
      sku: '',
      gender: 'unisex',
      is_new: false,
      featured: false,
      is_limited_edition: false,
      meta_title: '',
      meta_description: '',
    },
  });
  
  // Fetch categories and brands on mount
  useEffect(() => {
    const fetchLookupData = async () => {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        toast.error('Failed to load categories');
      } else {
        setCategories(categoriesData || []);
      }
      
      // For now we'll use categories as brands since we don't have a brands table
      setBrands(categoriesData || []);
    };
    
    fetchLookupData();
  }, []);
  
  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode && productId) {
      const fetchProduct = async () => {
        setIsLoading(true);
        
        try {
          // First get the product from the new products table structure
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
          
          if (error) throw error;
          
          const productData = data;
          setProduct(productData);
          
          // Load the product's images
          const { data: imageData, error: imageError } = await supabase
            .from('product_images')
            .select('image_url')
            .eq('product_id', productId)
            .order('display_order', { ascending: true });
          
          if (!imageError && imageData) {
            setImageUrls(imageData.map((img: any) => img.image_url));
          }
          
          // Set form values with safe access
          form.reset({
            name: productData?.name || '',
            slug: productData?.slug || '',
            description: productData?.description || '',
            price: productData?.price || 0,
            category_id: productData?.category_id || '',
            brand_id: productData?.category_id || '', // Using category as brand for now
            sku: productData?.sku || '',
            gender: productData?.gender || 'unisex',
            is_new: productData?.is_new || false,
            featured: productData?.featured || false,
            is_limited_edition: productData?.is_limited_edition || false,
            meta_title: productData?.meta_title || '',
            meta_description: productData?.meta_description || '',
          });
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
  
  const uploadImages = async (productId: string): Promise<string[]> => {
    if (imageFiles.length === 0) return [];
    
    const uploadedUrls: string[] = [];
    
    for (const [index, file] of imageFiles.entries()) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}-${Date.now()}-${index}.${fileExt}`;
      const filePath = `product-images/${fileName}`;
      
      const { error } = await supabase.storage
        .from('user-content')
        .upload(filePath, file);
      
      if (error) {
        console.error('Error uploading image:', error);
        toast.error(`Failed to upload image: ${file.name}`);
        continue;
      }
      
      const { data } = supabase.storage
        .from('user-content')
        .getPublicUrl(filePath);
      
      uploadedUrls.push(data.publicUrl);
    }
    
    return uploadedUrls;
  };
  
  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    
    try {
      // Generate a new slug if one wasn't provided
      if (!data.slug) {
        data.slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      }
      
      const productData = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        category_id: data.category_id,
        brand_id: data.brand_id,
        sku: data.sku,
        gender: data.gender,
        is_new: data.is_new || false,
        featured: data.featured || false,
        is_limited_edition: data.is_limited_edition || false,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        updated_at: new Date().toISOString(),
      };
      
      let productId: string;
      
      if (isEditMode) {
        // Update existing product
        const { data: updatedProduct, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product!.id)
          .select()
          .single();
        
        if (error) throw error;
        
        productId = product!.id;
        toast.success('Product updated successfully');
      } else {
        // Create new product
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();
        
        if (error) throw error;
        
        productId = (newProduct as any).id;
        toast.success('Product created successfully');
      }
      
      // Upload images if any
      if (imageFiles.length > 0) {
        const uploadedUrls = await uploadImages(productId);
        
        // Save image references in the product_images table
        if (uploadedUrls.length > 0) {
          const imageInserts = uploadedUrls.map((url, index) => ({
            product_id: productId,
            image_url: url,
            display_order: index + 1
          }));
          
          const { error } = await supabase
            .from('product_images')
            .insert(imageInserts);
          
          if (error) {
            console.error('Error saving image references:', error);
            toast.error('Failed to save some image references');
          }
        }
      }
      
      // Navigate back to product list
      navigate('/admin/products');
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
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category_id"
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
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
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
                name="brand_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands.map(brand => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
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
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select 
                      onValueChange={field.onChange as (value: string) => void} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="men">Men</SelectItem>
                        <SelectItem value="women">Women</SelectItem>
                        <SelectItem value="unisex">Unisex</SelectItem>
                        <SelectItem value="kids">Kids</SelectItem>
                      </SelectContent>
                    </Select>
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
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Product</FormLabel>
                      <FormDescription>
                        Highlight this product on the homepage
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
                name="is_new"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">New Arrival</FormLabel>
                      <FormDescription>
                        Mark as a new product
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
                name="is_limited_edition"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Limited Edition</FormLabel>
                      <FormDescription>
                        Mark as limited edition product
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
            
            <div>
              <FormLabel>Product Images</FormLabel>
              <div className="mt-2">
                <Input 
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="mb-4"
                />
                
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative rounded-md overflow-hidden h-32 bg-gray-100">
                        <img 
                          src={url} 
                          alt={`Product image ${index}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="meta_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input placeholder="SEO Title" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormDescription>
                      For SEO purposes (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="meta_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="SEO Description" 
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      For SEO purposes (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/products')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AdminProductForm;
