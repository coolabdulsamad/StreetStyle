
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ExtendedProduct } from '@/lib/types';
import { getProducts } from '@/lib/services/productService';

const AdminProductList: React.FC = () => {
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  
  const navigate = useNavigate();
  
  const fetchProducts = async (page = 1, query = '') => {
    setIsLoading(true);
    try {
      const { products, count } = await getProducts({
        searchQuery: query,
        page,
        limit,
      });
      
      setProducts(products);
      setTotalCount(count);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts(currentPage, searchQuery);
  }, [currentPage, limit]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(1, searchQuery);
  };
  
  const handleAddNewProduct = () => {
    navigate('/admin/products/new');
  };
  
  const handleEditProduct = (productId: string) => {
    navigate(`/admin/products/${productId}`);
  };
  
  const handleDeleteProduct = async (productId: string) => {
    try {
      // Delete related product variants first
      const { error: variantError } = await supabase
        .from('product_variants' as any)
        .delete()
        .eq('product_id', productId);
      
      if (variantError) throw variantError;
      
      // Delete product images
      const { error: imageError } = await supabase
        .from('product_images' as any)
        .delete()
        .eq('product_id', productId);
      
      if (imageError) throw imageError;
      
      // Delete product tags relationship
      const { error: tagsError } = await supabase
        .from('products_tags' as any)
        .delete()
        .eq('product_id', productId);
      
      if (tagsError) throw tagsError;
      
      // Finally delete the product
      const { error } = await supabase
        .from('products' as any)
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      toast.success('Product deleted successfully');
      fetchProducts(currentPage, searchQuery);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };
  
  const totalPages = Math.ceil(totalCount / limit);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Product Management</h2>
        <Button onClick={handleAddNewProduct}>Add New Product</Button>
      </div>
      
      <div className="bg-white rounded-md shadow overflow-hidden">
        <div className="p-4 border-b">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <p>No products found.</p>
            <Button onClick={handleAddNewProduct} className="mt-4">Add New Product</Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded">
                          {product.images && product.images[0] && (
                            <img
                              className="h-10 w-10 object-cover rounded"
                              src={product.images[0]}
                              alt={product.name}
                            />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {product.variants?.length || 0} variants
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.category?.name || 'Uncategorized'}
                    </TableCell>
                    <TableCell>
                      {product.brand?.name || 'No Brand'}
                    </TableCell>
                    <TableCell className="text-right">
                      ${product.price}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.featured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                        {product.new && (
                          <Badge variant="secondary">New</Badge>
                        )}
                        {product.is_limited_edition && (
                          <Badge variant="outline">Limited</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product.id)}
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
                                This will permanently delete this product and all its variants. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product.id)}
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
            
            {totalPages > 1 && (
              <div className="py-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      let pageNumber: number;
                      
                      if (totalPages <= 5) {
                        // If we have 5 or fewer pages, show all
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        // If we're near the start
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        // If we're near the end
                        pageNumber = totalPages - 4 + i;
                      } else {
                        // If we're in the middle
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNumber)}
                            isActive={pageNumber === currentPage}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink 
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProductList;
