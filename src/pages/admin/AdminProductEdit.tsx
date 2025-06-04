// @/pages/admin/AdminProductEdit.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
  getProductById,
  getProductCategories,
  getBrands,
  updateProduct,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
  uploadProductImage,
  deleteProductImage,
  updateProductImagesOrder,
} from '../../lib/services/productService1';
import { toast } from 'sonner';
import { ExtendedProduct, ProductUpdate } from '@/lib/types'; // Ensure ProductUpdate is imported
import { Loader2, PlusCircle, Trash2, Image as ImageIcon, Ruler, Palette } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Badge } from '@/components/ui/badge';

// Define local types for new/edited variants/images (needed before they have DB IDs)
interface EditableProductVariant {
  id: string; // Will be UUID from DB for existing, temp UUID for new
  name?: string | null;
  sku: string;
  stock: number;
  price: number;
  color?: string | null;
  size?: string | null;
  color_hex?: string | null;
  isNew?: boolean; // Flag for newly added variants
  isDeleted?: boolean; // Flag for variants marked for deletion
}

interface EditableProductImage {
  id: string; // UUID from DB for existing, temp UUID for new
  image_url: string;
  display_order: number;
  file?: File; // For newly uploaded images
  isNew?: boolean; // Flag for newly added images
  isDeleted?: boolean; // Flag for images marked for deletion
  product_id?: string; // Added for clarity, though it comes from product context
}

const AdminProductEdit = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthReady, isAdmin } = useAuth();

  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  const [variants, setVariants] = useState<EditableProductVariant[]>([]);
  const [images, setImages] = useState<EditableProductImage[]>([]);
  // No need for a separate newImageFiles state if we track files directly in `images` state with `isNew` flag

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthReady || !isAdmin) {
        setIsLoading(false);
        // Redirect if not authenticated or not admin, but allow auth state to settle
        if (isAuthReady && !isAdmin) {
          toast.error("Access Denied: You must be an administrator.");
          navigate('/'); // or '/login'
        }
        return;
      }
      setIsLoading(true);
      try {
        if (!productId) {
          toast.error('Product ID is missing.');
          navigate('/admin/products');
          return;
        }

        const { product: fetchedProduct, error: productError } = await getProductById(productId);

        if (productError) {
          toast.error(productError.message || 'Failed to load product details.');
          navigate('/admin/products');
          return;
        }

        if (fetchedProduct) {
          setProduct(fetchedProduct);
          // Initialize variants and images with isNew/isDeleted flags
          setVariants(fetchedProduct.variants.map(v => ({ ...v, isNew: false, isDeleted: false })));
          setImages(fetchedProduct.images.map(img => ({ ...img, isNew: false, isDeleted: false, product_id: fetchedProduct.id }))); // Ensure product_id is set
        } else {
          toast.error('Product not found.');
          navigate('/admin/products');
          return;
        }

        const fetchedCategories = await getProductCategories();
        const fetchedBrands = await getBrands();
        setCategories(fetchedCategories);
        setBrands(fetchedBrands);

      } catch (error) {
        console.error('Error fetching product data for edit:', error);
        toast.error('Failed to load product details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId, isAuthReady, isAdmin, navigate]);

  // --- Product Field Handlers ---
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProduct((prev) => prev ? { ...prev, [id]: value } : null);
  }, []);

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProduct((prev) => prev ? { ...prev, [id]: parseFloat(value) || 0 } : null);
  }, []);

  const handleCheckboxChange = useCallback((id: keyof ExtendedProduct, checked: boolean) => {
    setProduct((prev) => prev ? { ...prev, [id]: checked } : null);
  }, []);

  const handleSelectChange = useCallback((id: string, value: string) => {
    setProduct((prev) => {
      if (!prev) return null;
      if (id === 'category_id') {
        const selectedCat = categories.find(cat => cat.id === value);
        return { ...prev, category_id: value, category: selectedCat || null };
      }
      if (id === 'brand_id') {
        const selectedBrand = brands.find(b => b.id === value);
        return { ...prev, brand_id: value, brand: selectedBrand || null };
      }
      if (id === 'gender') {
        return { ...prev, gender: value };
      }
      return prev;
    });
  }, [categories, brands]);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProduct((prev) => prev ? { ...prev, [id]: value ? new Date(value).toISOString() : null } : null);
  }, []);


  // --- Variant Management Handlers ---
  const handleVariantChange = useCallback((index: number, field: keyof EditableProductVariant, value: any) => {
    setVariants((prev) => {
      const newVariants = [...prev];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return newVariants;
    });
  }, []);

  const handleAddVariant = useCallback(() => {
    setVariants((prev) => [
      ...prev,
      {
        id: uuidv4(), // Temporary ID for new variant
        sku: '',
        stock: 0,
        price: product?.price || 0, // Default to product's base price
        isNew: true,
      },
    ]);
  }, [product]);

  const handleRemoveVariant = useCallback((index: number) => {
    setVariants((prev) => {
      const newVariants = [...prev];
      if (!newVariants[index].isNew) {
        // Mark existing variant for deletion
        newVariants[index] = { ...newVariants[index], isDeleted: true };
      } else {
        // Completely remove newly added (unsaved) variant
        newVariants.splice(index, 1);
      }
      return newVariants; // Don't filter immediately, filter before saving
    });
  }, []);

  // --- Image Management Handlers ---
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      // Add temporary image entries to display them immediately
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => {
            const tempId = uuidv4();
            return [
              ...prev,
              {
                id: tempId, // Temporary ID
                image_url: reader.result as string,
                display_order: prev.length, // Simple initial order
                file: file, // Store the File object
                isNew: true,
                isDeleted: false,
                product_id: product?.id, // Ensure product_id for new images too if needed for backend
              },
            ];
          });
        };
        reader.readAsDataURL(file);
      });
      // Clear the input after files are selected
      e.target.value = '';
    }
  }, [product]);

  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => {
      const newImages = prev.map(img =>
        img.id === id ? { ...img, isDeleted: true } : img
      );
      return newImages; // Don't filter immediately, filter before saving
    });
  }, []);

  // Function to reorder images (drag and drop would be better, but this is a simple version)
  const handleMoveImage = useCallback((id: string, direction: 'up' | 'down') => {
    setImages(prevImages => {
      const currentVisibleImages = [...prevImages].filter(img => !img.isDeleted);
      const index = currentVisibleImages.findIndex(img => img.id === id);
      if (index === -1) return prevImages; // Should not happen

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= currentVisibleImages.length) return prevImages;

      const [movedImage] = currentVisibleImages.splice(index, 1);
      currentVisibleImages.splice(targetIndex, 0, movedImage);

      // Re-assign display_order based on new array order for ALL images (including deleted ones not shown)
      const updatedImages = prevImages.map(img => {
        const foundInVisible = currentVisibleImages.find(ci => ci.id === img.id);
        if (foundInVisible) {
          return { ...img, display_order: currentVisibleImages.indexOf(foundInVisible) };
        }
        return img; // For images that are deleted, keep their state
      });
      return updatedImages;
    });
  }, []);

  // --- Form Submission Logic ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || isSaving) return;

    setIsSaving(true);
    toast.info('Saving product changes...');

    try {
      // 1. Update Product Details
      const updatedProductData: ProductUpdate = {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        category_id: product.category?.id || null,
        brand_id: product.brand?.id || null,
        gender: product.gender,
        is_new: product.is_new,
        featured: product.featured,
        is_limited_edition: product.is_limited_edition,
        sku: product.sku || null,
        original_price: product.original_price || null,
        is_sale: product.is_sale || false,
        release_date: product.release_date || null,
      };

      const productUpdateSuccess = await updateProduct(product.id, updatedProductData);
      if (!productUpdateSuccess) throw new Error('Failed to update main product details.');

      // 2. Process Variants (Create, Update, Delete)
      const variantsToCreate = variants.filter(v => v.isNew && !v.isDeleted);
      const variantsToUpdate = variants.filter(v => !v.isNew && !v.isDeleted);
      const variantsToDelete = variants.filter(v => v.isDeleted && !v.isNew); // Ensure it's an existing variant marked for deletion

      for (const variant of variantsToCreate) {
        const newVariant = await createProductVariant({
          product_id: product.id,
          name: variant.name || null,
          sku: variant.sku,
          stock: variant.stock,
          price: variant.price,
          color: variant.color || null,
          size: variant.size || null,
          color_hex: variant.color_hex || null,
        });
        if (!newVariant) throw new Error(`Failed to create variant ${variant.sku}`);
      }

      for (const variant of variantsToUpdate) {
        const success = await updateProductVariant(variant.id, {
          name: variant.name || null,
          sku: variant.sku,
          stock: variant.stock,
          price: variant.price,
          color: variant.color || null,
          size: variant.size || null,
          color_hex: variant.color_hex || null,
        });
        if (!success) throw new Error(`Failed to update variant ${variant.sku}`);
      }

      for (const variant of variantsToDelete) {
        const success = await deleteProductVariant(variant.id);
        if (!success) console.warn(`Failed to delete variant ${variant.id}, continuing save.`);
      }

      // 3. Process Images (Upload new, Delete old, Update order)
      const imagesToUpload = images.filter(img => img.isNew && img.file && !img.isDeleted);
      const imagesToDelete = images.filter(img => img.isDeleted && !img.isNew);
      const imagesToUpdateOrder = images.filter(img => !img.isDeleted && !img.isNew); // Get all current *active* images for order update

      // Upload new images first to get their DB IDs
      for (const newImage of imagesToUpload) {
        const uploadedImage = await uploadProductImage(product.id, newImage.file!, newImage.display_order); // Use its tracked display_order
        if (!uploadedImage) throw new Error(`Failed to upload image ${newImage.file?.name}`);
      }

      // Delete images marked as deleted
      for (const img of imagesToDelete) {
        const success = await deleteProductImage(img.id, img.image_url);
        if (!success) console.warn(`Failed to delete image ${img.id}, continuing save.`);
      }

      // Update display order for all remaining non-deleted images
      const finalImageOrderUpdates = imagesToUpdateOrder
        .map((img, index) => ({
          id: img.id,
          display_order: index, // Re-assign based on the current filtered array order
          product_id: product.id,
          image_url: img.image_url, // <--- ADDED THIS LINE!
        }));

      if (finalImageOrderUpdates.length > 0) {
         const orderSuccess = await updateProductImagesOrder(finalImageOrderUpdates);
         if (!orderSuccess) console.warn('Failed to update image display order, continuing save.');
      }


      toast.success('Product and all related data updated successfully!');
      navigate('/admin/products');

    } catch (error: any) {
      console.error('Full product save failed:', error);
      toast.error(`Error saving product: ${error.message || 'An unexpected error occurred.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthReady) {
    return <div className="flex items-center justify-center min-h-screen">Loading authentication...</div>;
  }

  if (!isAdmin) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Access Denied: You must be an administrator to view this page.</div>;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="mr-2 h-8 w-8 animate-spin" /> Loading product details...</div>;
  }

  if (!product) {
      return <div className="flex items-center justify-center min-h-screen text-red-500">Product not found or access denied.</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <h1 className="text-3xl font-bold">Edit Product: {product.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Update core details for this product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" value={product.name || ''} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="slug">Product Slug</Label>
                <Input id="slug" value={product.slug || ''} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={product.description || ''} onChange={handleChange} rows={5} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="price">Base Price</Label>
                <Input id="price" type="number" step="0.01" value={product.price || 0} onChange={handlePriceChange} required />
              </div>
              <div>
                <Label htmlFor="original_price">Original Price (for Sale)</Label>
                <Input id="original_price" type="number" step="0.01" value={product.original_price || ''} onChange={handlePriceChange} />
              </div>
              <div>
                <Label htmlFor="sku">Product SKU (Base)</Label>
                <Input id="sku" value={product.sku || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={product.gender || ''}
                  onValueChange={(value) => handleSelectChange('gender', value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                    <SelectItem value="kids">Kids</SelectItem>
                    <SelectItem value="baby">Baby</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category_id">Category</Label>
                <Select
                  value={product.category?.id || ''}
                  onValueChange={(value) => handleSelectChange('category_id', value)}
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
                  value={product.brand?.id || ''}
                  onValueChange={(value) => handleSelectChange('brand_id', value)}
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
            <div>
              <Label htmlFor="release_date">Release Date</Label>
              <Input
                id="release_date"
                type="date"
                value={product.release_date ? new Date(product.release_date).toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_new"
                  checked={product.is_new || false}
                  onCheckedChange={(checked: boolean) => handleCheckboxChange('is_new', checked)}
                />
                <Label htmlFor="is_new">New Arrival</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={product.featured || false}
                  onCheckedChange={(checked: boolean) => handleCheckboxChange('featured', checked)}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_limited_edition"
                  checked={product.is_limited_edition || false}
                  onCheckedChange={(checked: boolean) => handleCheckboxChange('is_limited_edition', checked)}
                />
                <Label htmlFor="is_limited_edition">Limited Edition</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_sale"
                  checked={product.is_sale || false}
                  onCheckedChange={(checked: boolean) => handleCheckboxChange('is_sale', checked)}
                />
                <Label htmlFor="is_sale">On Sale</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Variants Card */}
        <Card>
          <CardHeader>
            <CardTitle>Product Variants</CardTitle>
            <CardDescription>Add, edit, or remove different sizes, colors, or styles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {variants.filter(v => !v.isDeleted).length === 0 && (
              <p className="text-muted-foreground text-sm">No variants added yet. Add one below!</p>
            )}
            {variants.filter(v => !v.isDeleted).map((variant, index) => (
              <div key={variant.id} className="border p-4 rounded-md space-y-3 relative">
                <h4 className="font-semibold text-md mb-2 flex items-center gap-2">
                  Variant {index + 1}
                  {variant.isNew && <Badge variant="secondary">New</Badge>}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor={`variant-sku-${index}`}>SKU</Label>
                    <Input
                      id={`variant-sku-${index}`}
                      value={variant.sku || ''}
                      onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`variant-name-${index}`}>Name (Optional)</Label>
                    <Input
                      id={`variant-name-${index}`}
                      value={variant.name || ''}
                      onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`variant-price-${index}`}>Price</Label>
                    <Input
                      id={`variant-price-${index}`}
                      type="number"
                      step="0.01"
                      value={variant.price || 0}
                      onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`variant-stock-${index}`}>Stock</Label>
                    <Input
                      id={`variant-stock-${index}`}
                      type="number"
                      step="1"
                      value={variant.stock || 0}
                      onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`variant-color-${index}`} className="flex items-center gap-1">
                      <Palette className="h-4 w-4 text-muted-foreground" /> Color
                    </Label>
                    <Input
                      id={`variant-color-${index}`}
                      value={variant.color || ''}
                      onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`variant-color-hex-${index}`} className="flex items-center gap-1">
                      <Palette className="h-4 w-4 text-muted-foreground" /> Color Hex
                    </Label>
                    <Input
                      id={`variant-color-hex-${index}`}
                      type="color"
                      value={variant.color_hex || '#ffffff'}
                      onChange={(e) => handleVariantChange(index, 'color_hex', e.target.value)}
                      className="w-full h-10 p-0 rounded-md"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`variant-size-${index}`} className="flex items-center gap-1">
                      <Ruler className="h-4 w-4 text-muted-foreground" /> Size
                    </Label>
                    <Input
                      id={`variant-size-${index}`}
                      value={variant.size || ''}
                      onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-red-500 hover:bg-red-50"
                  onClick={() => handleRemoveVariant(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={handleAddVariant}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Variant
            </Button>
          </CardContent>
        </Card>

        {/* Product Images Card */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>Upload, reorder, and remove product images.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.filter(img => !img.isDeleted).map((image, index) => (
                <div key={image.id} className="relative group border rounded-md overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={`Product Image ${image.id}`}
                    className="w-full h-32 object-cover"
                    onError={(e) => { e.currentTarget.src = `https://placehold.co/128x128/cccccc/333333?text=Img+Err`; }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveImage(image.id)}
                      className="opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => handleMoveImage(image.id, 'up')}
                      disabled={index === 0}
                      className="opacity-100"
                    >
                      &uarr; {/* Up arrow */}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => handleMoveImage(image.id, 'down')}
                      disabled={index === images.filter(img => !img.isDeleted).length - 1}
                      className="opacity-100"
                    >
                      &darr; {/* Down arrow */}
                    </Button>
                  </div>
                  <Badge variant="outline" className="absolute top-1 left-1">Order: {image.display_order}</Badge>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="image-upload">Upload New Images</Label>
              <Input id="image-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} />
              <p className="text-muted-foreground text-sm mt-1">Select one or more image files.</p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button for the entire form */}
        <Button type="submit" disabled={isSaving} className="w-full">
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </form>
    </div>
  );
};

export default AdminProductEdit;