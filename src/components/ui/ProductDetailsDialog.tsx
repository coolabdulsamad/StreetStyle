// @/components/ProductDetailsDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { ExtendedProduct } from '@/lib/services/productService1'; // Adjust path if necessary
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom'; // Import Link for navigation

interface ProductDetailsDialogProps {
  product: ExtendedProduct | null;
  isOpen: boolean;
  onClose: () => void;
  // onDeleteVariant: (variantId: string) => void; // Placeholder for future variant deletion
  // onEditVariant: (variantId: string) => void; // Placeholder for future variant editing
}

const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({ product, isOpen, onClose }) => {
  if (!product) return null; // Don't render if no product is selected

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name} Details</DialogTitle>
          <DialogDescription>
            Comprehensive view of the product and its variants.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Product Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Product Information</h3>
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Category:</strong> {product.category?.name || 'N/A'}</p>
              <p><strong>Brand:</strong> {product.brand?.name || 'N/A'}</p>
              <p><strong>Base Price:</strong> ${product.price.toFixed(2)}</p>
              {product.original_price && product.is_sale && (
                <p><strong>Original Price:</strong> <span className="line-through">${product.original_price.toFixed(2)}</span></p>
              )}
              <p><strong>SKU:</strong> {product.sku || 'N/A'}</p>
              <p><strong>Gender:</strong> {product.gender || 'N/A'}</p>
              <p><strong>Release Date:</strong> {product.release_date ? new Date(product.release_date).toLocaleDateString() : 'N/A'}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.is_new && <Badge variant="secondary">New</Badge>}
                {product.is_sale && <Badge variant="destructive">Sale</Badge>}
                {product.is_limited_edition && <Badge variant="outline">Limited Edition</Badge>}
                {product.featured && <Badge variant="default">Featured</Badge>}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Images</h3>
              <div className="grid grid-cols-3 gap-2">
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, index) => (
                    <img
                      key={img.id || index}
                      src={img.image_url}
                      alt={`${product.name} image ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                      onError={(e) => { e.currentTarget.src = `https://placehold.co/100x100/cccccc/333333?text=Img+Err`; }}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-muted-foreground text-sm">No images available.</div>
                )}
              </div>
              <h3 className="font-semibold text-lg mt-4 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags && product.tags.length > 0 ? (
                  product.tags.map((tagObj, index) => (
                    <Badge key={tagObj.tag.id || index} variant="outline">{tagObj.tag.name}</Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">No tags.</span>
                )}
              </div>
            </div>
          </div>

          {/* Product Variants Table */}
          <h3 className="font-semibold text-lg mt-6 mb-2">Product Variants</h3>
          {product.variants && product.variants.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">SKU</TableHead>
                    <TableHead className="min-w-[150px]">Name</TableHead>
                    <TableHead className="min-w-[100px]">Color</TableHead>
                    <TableHead className="min-w-[80px]">Size</TableHead>
                    <TableHead className="text-right min-w-[100px]">Price</TableHead>
                    <TableHead className="text-right min-w-[80px]">Stock</TableHead>
                    <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.variants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell>{variant.sku}</TableCell>
                      <TableCell>{variant.name || 'N/A'}</TableCell>
                      <TableCell>
                        {variant.color || 'N/A'}
                        {variant.color_hex && (
                          <span
                            className="ml-2 inline-block w-4 h-4 rounded-full border"
                            style={{ backgroundColor: variant.color_hex }}
                            title={variant.color_hex}
                          ></span>
                        )}
                      </TableCell>
                      <TableCell>{variant.size || 'N/A'}</TableCell>
                      <TableCell className="text-right">${variant.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{variant.stock}</TableCell>
                      <TableCell className="text-right">
                        {/* Use Link to navigate to the edit page */}
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/products/${product.id}`}> {/* Navigate to the main product edit page */}
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" /* onClick={() => onDeleteVariant(variant.id)} */>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">No variants found for this product.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
