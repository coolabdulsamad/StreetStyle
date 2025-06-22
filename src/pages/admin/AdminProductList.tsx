// @/pages/admin/AdminProductList.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getProducts, deleteProduct } from '../../lib/services/productService1';
import { ExtendedProduct } from '../../lib/services/productService1'; // Ensure this path is correct
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '../../lib/utils';

// Import AlertDialog components from shadcn/ui
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Adjust path if necessary

// Import the new ProductDetailsDialog component
import ProductDetailsDialog from '@/components/ui/ProductDetailsDialog'; // Adjust path if necessary

const AdminProductList = () => {
  const { isAuthReady, isAdmin } = useAuth();
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null); // State for the product whose details are being viewed
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false); // State to control dialog visibility

  // Function to fetch products
  const fetchProducts = async () => {
    if (!isAuthReady || !isAdmin) {
      setIsLoadingProducts(false);
      return;
    }

    setIsLoadingProducts(true);
    try {
      const { products: fetchedProducts } = await getProducts({ limit: 100 });
      setProducts(fetchedProducts);
      console.log('Fetched Products for Admin List:', fetchedProducts); // Debug log
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products for admin panel.');
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [isAuthReady, isAdmin]);

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      const success = await deleteProduct(productToDelete);
      if (success) {
        setProducts(products.filter(p => p.id !== productToDelete));
      }
      setProductToDelete(null);
    }
  };

  const handleViewDetails = (product: ExtendedProduct) => {
    setSelectedProduct(product);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedProduct(null); // Clear selected product when dialog closes
  };

  if (!isAuthReady) {
    return <div className="flex items-center justify-center min-h-screen">Loading authentication...</div>;
  }

  if (!isAdmin) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Access Denied: You must be an administrator to view this page.</div>;
  }

  if (isLoadingProducts) {
    return <div className="flex items-center justify-center min-h-screen">Loading products...</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button asChild>
          <Link to="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>Manage your store's product catalog.</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-muted-foreground">No products found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] min-w-[80px]">Image</TableHead>
                    <TableHead className="min-w-[150px]">Name</TableHead>
                    <TableHead className="min-w-[100px]">Category</TableHead>
                    <TableHead className="min-w-[100px]">Brand</TableHead>
                    <TableHead className="min-w-[80px]">SKU</TableHead>
                    <TableHead className="text-right min-w-[100px]">Price</TableHead>
                    <TableHead className="text-right min-w-[100px]">Total Stock</TableHead>
                    <TableHead className="min-w-[120px]">Status</TableHead>
                    <TableHead className="min-w-[80px]">Gender</TableHead>
                    <TableHead className="min-w-[150px]">Tags</TableHead>
                    <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const totalStock = product.variants && product.variants.length > 0
                      ? product.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0)
                      : 0;

                    return (
                      <TableRow key={product.id} onClick={() => handleViewDetails(product)} className="cursor-pointer hover:bg-gray-50">
                        <TableCell>
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0].image_url} alt={product.name} className="w-16 h-16 object-cover rounded" />
                          ) : (
                            <div className="w-16 h-16 bg-muted flex items-center justify-center rounded text-xs text-muted-foreground">No Image</div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category?.name || 'N/A'}</TableCell>
                        <TableCell>{product.brand?.name || 'N/A'}</TableCell>
                        <TableCell>{product.sku || 'N/A'}</TableCell>
                        <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                        <TableCell className="text-right">{totalStock}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {product.is_new && <Badge variant="secondary">New</Badge>}
                            {product.is_sale && <Badge variant="destructive">Sale</Badge>}
                            {product.is_limited_edition && <Badge variant="outline">Limited Ed.</Badge>}
                            {!product.is_new && !product.is_sale && !product.is_limited_edition && (
                              <Badge variant="outline" className="text-muted-foreground">Standard</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{product.gender || 'N/A'}</TableCell>
                        <TableCell className="min-w-[150px]">
                          <div className="flex flex-wrap gap-1">
                            {product.tags && product.tags.length > 0 ? (
                              product.tags.map(tagObj => (
                                <Badge key={tagObj.tag.id} variant="outline">{tagObj.tag.name}</Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-xs">No tags</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {/* Wrapper div to fix React Children errors */}
                          <div className="flex justify-end space-x-1">
                            {/* Edit button: keep it separate from row click for specific edit action */}
                            <Button variant="ghost" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                              <Link to={`/admin/products/${product.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            {/* Delete Button with AlertDialog */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setProductToDelete(product.id); }}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the product
                                    and remove its data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        product={selectedProduct}
        isOpen={isDetailsDialogOpen}
        onClose={handleCloseDetailsDialog}
      />
    </div>
  );
};

export default AdminProductList;
