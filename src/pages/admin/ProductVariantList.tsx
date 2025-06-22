import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProductVariant } from '@/lib/types';
import ProductVariantForm from './ProductVariantForm';
import { formatPrice } from '@/lib/utils';

interface ProductVariantListProps {
  productId: string;
}

const ProductVariantList: React.FC<ProductVariantListProps> = ({ productId }) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<ProductVariant | undefined>(undefined);
  
  // Fetch product variants
  const fetchVariants = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_variants' as any)
        .select('*')
        .eq('product_id', productId)
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      setVariants(data as unknown as ProductVariant[]);
    } catch (error) {
      console.error('Error fetching variants:', error);
      toast.error('Failed to load product variants');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchVariants();
  }, [productId]);
  
  const handleEdit = (variant: ProductVariant) => {
    setCurrentVariant(variant);
    setShowForm(true);
  };
  
  const handleDelete = async (variantId: string) => {
    try {
      const { error } = await supabase
        .from('product_variants' as any)
        .delete()
        .eq('id', variantId);
      
      if (error) throw error;
      
      // Refresh the variants list
      fetchVariants();
      toast.success('Variant deleted successfully');
    } catch (error) {
      console.error('Error deleting variant:', error);
      toast.error('Failed to delete variant');
    }
  };
  
  const handleFormSave = () => {
    fetchVariants();
    setShowForm(false);
    setCurrentVariant(undefined);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentVariant(undefined);
  };
  
  const handleAddVariant = () => {
    setCurrentVariant(undefined);
    setShowForm(true);
  };
  
  if (showForm) {
    return (
      <ProductVariantForm 
        productId={productId}
        variant={currentVariant}
        onSave={handleFormSave}
        onCancel={handleFormCancel}
      />
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Variants</CardTitle>
        <Button onClick={handleAddVariant}>Add Variant</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center py-4">Loading variants...</p>
        ) : variants.length === 0 ? (
          <p className="text-center py-4">No variants found. Click "Add Variant" to create one.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map(variant => (
                <TableRow key={variant.id}>
                  <TableCell>{variant.name}</TableCell>
                  <TableCell>{variant.size || '-'}</TableCell>
                  <TableCell>{variant.color || '-'}</TableCell>
                  <TableCell className="text-right">{formatPrice(variant.price)}</TableCell>
                  <TableCell className="text-right">{variant.stock}</TableCell>
                  <TableCell>{variant.sku}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(variant)}
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this variant. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(variant.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductVariantList;
