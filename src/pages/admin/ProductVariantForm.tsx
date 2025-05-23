
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProductVariant } from '@/lib/types';

const variantFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  size: z.string().optional(),
  color: z.string().optional(),
  price: z.coerce.number().positive('Price must be positive'),
  stock: z.coerce.number().int().nonnegative('Stock must be zero or positive'),
  sku: z.string().min(1, 'SKU is required'),
});

type VariantFormValues = z.infer<typeof variantFormSchema>;

interface ProductVariantFormProps {
  productId: string;
  variant?: ProductVariant;
  onSave: () => void;
  onCancel: () => void;
}

const ProductVariantForm: React.FC<ProductVariantFormProps> = ({
  productId,
  variant,
  onSave,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditMode = !!variant;
  
  const form = useForm<VariantFormValues>({
    resolver: zodResolver(variantFormSchema),
    defaultValues: {
      name: variant?.name || '',
      size: variant?.size || '',
      color: variant?.color || '',
      price: variant?.price || 0,
      stock: variant?.stock || 0,
      sku: variant?.sku || '',
    },
  });
  
  const onSubmit = async (data: VariantFormValues) => {
    setIsLoading(true);
    
    try {
      const variantData = {
        ...data,
        product_id: productId,
        updated_at: new Date().toISOString(),
      };
      
      if (isEditMode) {
        // Update existing variant
        const { error } = await supabase
          .from('product_variants' as any)
          .update(variantData)
          .eq('id', variant!.id);
        
        if (error) throw error;
        
        toast.success('Variant updated successfully');
      } else {
        // Create new variant
        const { error } = await supabase
          .from('product_variants' as any)
          .insert([variantData]);
        
        if (error) throw error;
        
        toast.success('Variant created successfully');
      }
      
      onSave();
    } catch (error: any) {
      console.error('Error saving variant:', error);
      toast.error(`Failed to save variant: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Variant' : 'Add New Variant'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Small Red" {...field} />
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
                      <Input placeholder="e.g., PROD-SM-RED" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., S, M, L, XL, 42" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Red, Blue, Black" {...field} />
                    </FormControl>
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
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : isEditMode ? 'Update Variant' : 'Add Variant'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductVariantForm;
