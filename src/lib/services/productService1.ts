import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

// Re-exporting types from your central types file for consistency
// Ensure '@/lib/types' is up-to-date with your full schema, especially ExtendedProduct
import { Product, ProductCategory, Brand, ExtendedProduct } from '@/lib/types';

// ============================================================================
// Types
// ============================================================================

type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];
type ProductImageInsert = Database['public']['Tables']['product_images']['Insert'];
type ProductImageUpdate = Database['public']['Tables']['product_images']['Update'];
type ProductVariantInsert = Database['public']['Tables']['product_variants']['Insert'];
type ProductVariantUpdate = Database['public']['Tables']['product_variants']['Update'];
type ProductVariantRow = Database['public']['Tables']['product_variants']['Row'];
type ProductImageRow = Database['public']['Tables']['product_images']['Row'];


// ============================================================================
// Product CRUD Operations
// ============================================================================

/**
 * Fetches a single product by its ID with all related data (category, brand, images, variants, tags).
 * This will be used for the edit page.
 * @param productId The ID (UUID) of the product to fetch.
 * @returns An object containing the fetched ExtendedProduct and any error.
 */
export const getProductById = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:product_categories ( id, name, slug ),
        brand:brands ( id, name, slug, logo_url ),
        images:product_images ( id, image_url, display_order ),
        variants:product_variants ( id, name, sku, stock, price, color, size, color_hex, created_at, updated_at ),
        tags:products_tags(
          tag:tags(id, name, slug)
        )
      `)
      .eq('id', productId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Supabase error fetching product by ID:', error);
      throw new Error(error.message);
    }

    if (!data) {
      return { product: null, error: new Error('Product not found.') };
    }

    // Map the data to the ExtendedProduct type, handling potential nulls and nested arrays
    const product: ExtendedProduct = {
      ...data,
      category: data.category as ProductCategory | null,
      brand: data.brand as Brand | null,
      images: (data.images as ProductImageRow[]).sort((a, b) => a.display_order - b.display_order),
      variants: data.variants as ProductVariantRow[],
      tags: (data.tags as { tag: Database['public']['Tables']['tags']['Row'] }[]),
    };

    return { product, error: null };

  } catch (err: any) {
    console.error('Error in getProductById service:', err);
    return { product: null, error: err };
  }
};

/**
 * Updates an existing product in the database.
 * @param productId The ID of the product to update.
 * @param productData The data to update.
 * @returns A boolean indicating success.
 */
export const updateProduct = async (productId: string, productData: ProductUpdate): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId);

    if (error) {
      console.error('Supabase error updating product:', error);
      toast.error(`Failed to update product: ${error.message}`);
      return false;
    }

    toast.success('Product details updated successfully!');
    return true;
  } catch (err: any) {
    console.error('Error in updateProduct service:', err);
    toast.error(`An unexpected error occurred during product update: ${err.message}`);
    return false;
  }
};

// ============================================================================
// Product Variant CRUD Operations
// ============================================================================

/**
 * Creates a new product variant.
 * @param variantData The data for the new variant.
 * @returns The created variant or null if an error occurs.
 */
export const createProductVariant = async (variantData: ProductVariantInsert): Promise<ProductVariantRow | null> => {
  try {
    const { data, error } = await supabase
      .from('product_variants')
      .insert(variantData)
      .select() // Select the newly inserted row
      .single();

    if (error) {
      console.error('Supabase error creating product variant:', error);
      toast.error(`Failed to create variant: ${error.message}`);
      return null;
    }

    toast.success('Product variant added!');
    return data;
  } catch (err: any) {
    console.error('Error in createProductVariant service:', err);
    toast.error(`An unexpected error occurred during variant creation: ${err.message}`);
    return null;
  }
};

/**
 * Updates an existing product variant.
 * @param variantId The ID of the variant to update.
 * @param variantData The data to update.
 * @returns A boolean indicating success.
 */
export const updateProductVariant = async (variantId: string, variantData: ProductVariantUpdate): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('product_variants')
      .update(variantData)
      .eq('id', variantId);

    if (error) {
      console.error('Supabase error updating product variant:', error);
      toast.error(`Failed to update variant: ${error.message}`);
      return false;
    }

    toast.success('Product variant updated!');
    return true;
  } catch (err: any) {
    console.error('Error in updateProductVariant service:', err);
    toast.error(`An unexpected error occurred during variant update: ${err.message}`);
    return false;
  }
};

/**
 * Deletes a product variant.
 * @param variantId The ID of the variant to delete.
 * @returns A boolean indicating success.
 */
export const deleteProductVariant = async (variantId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('product_variants')
      .delete()
      .eq('id', variantId);

    if (error) {
      console.error('Supabase error deleting product variant:', error);
      toast.error(`Failed to delete variant: ${error.message}`);
      return false;
    }

    toast.success('Product variant deleted!');
    return true;
  } catch (err: any) {
    console.error('Error in deleteProductVariant service:', err);
    toast.error(`An unexpected error occurred during variant deletion: ${err.message}`);
    return false;
  }
};

// ============================================================================
// Product Image CRUD Operations
// ============================================================================

/**
 * Uploads a new image to Supabase Storage and inserts its URL into product_images table.
 * @param productId The ID of the product this image belongs to.
 * @param file The image file to upload.
 * @param displayOrder The order in which the image should be displayed.
 * @returns The created image row or null if an error occurs.
 */
export const uploadProductImage = async (
  productId: string,
  file: File,
  displayOrder: number
): Promise<ProductImageRow | null> => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${productId}/${Date.now()}.${fileExtension}`; // Unique path for each image
    const { data: storageData, error: storageError } = await supabase.storage
      .from('productimagesbucket') // Replace with your actual bucket name
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false, // Don't overwrite if file exists with same name
      });

    if (storageError) {
      console.error('Supabase storage upload error:', storageError);
      toast.error(`Failed to upload image: ${storageError.message}`);
      return null;
    }

    // Get the public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('productimagesbucket') // Replace with your actual bucket name
      .getPublicUrl(fileName);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      toast.error('Failed to get public URL for image.');
      return null;
    }

    // Insert image details into the product_images table
    const { data: imageData, error: dbError } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        image_url: publicUrlData.publicUrl,
        display_order: displayOrder,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Supabase DB insert error for image:', dbError);
      // Optional: Delete the file from storage if DB insert fails
      await supabase.storage.from('productimagesbucket').remove([fileName]);
      toast.error(`Failed to save image details: ${dbError.message}`);
      return null;
    }

    toast.success('Image uploaded and saved!');
    return imageData;
  } catch (err: any) {
    console.error('Error in uploadProductImage service:', err);
    toast.error(`An unexpected error occurred during image upload: ${err.message}`);
    return null;
  }
};

/**
 * Deletes an image from Supabase Storage and its record from product_images table.
 * @param imageId The ID of the image record in the database.
 * @param imageUrl The URL of the image in storage (used to get the storage path).
 * @returns A boolean indicating success.
 */
export const deleteProductImage = async (imageId: string, imageUrl: string): Promise<boolean> => {
  try {
    // Extract the file path from the image URL
    // Assumes URL format like: [supabase_url]/storage/v1/object/public/bucket_name/path/to/file.jpg
    const urlParts = imageUrl.split('/');
    const bucketNameIndex = urlParts.indexOf('public') + 1; // Find 'public' and then get next part
    const storagePath = urlParts.slice(bucketNameIndex).join('/');

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('productimagesbucket') // Replace with your actual bucket name
      .remove([storagePath]);

    if (storageError) {
      console.error('Supabase storage delete error:', storageError);
      toast.error(`Failed to delete image from storage: ${storageError.message}`);
      return false;
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('product_images')
      .delete()
      .eq('id', imageId);

    if (dbError) {
      console.error('Supabase DB delete error for image:', dbError);
      toast.error(`Failed to delete image record: ${dbError.message}`);
      // Optional: If storage delete succeeded but DB failed, you might want to re-upload or log for manual cleanup
      return false;
    }

    toast.success('Image deleted!');
    return true;
  } catch (err: any) {
    console.error('Error in deleteProductImage service:', err);
    toast.error(`An unexpected error occurred during image deletion: ${err.message}`);
    return false;
  }
};


/**
 * Updates the display order of product images.
 * This is an array of objects with id and display_order.
 */
export const updateProductImagesOrder = async (
  updates: { id: string; display_order: number }[]
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('product_images').upsert(updates, {
      onConflict: 'id', // Update if id exists
      ignoreDuplicates: false,
    });

    if (error) {
      console.error('Supabase error updating image order:', error);
      toast.error(`Failed to update image order: ${error.message}`);
      return false;
    }
    toast.success('Image order updated!');
    return true;
  } catch (err: any) {
    console.error('Error in updateProductImagesOrder service:', err);
    toast.error(`An unexpected error occurred during image order update: ${err.message}`);
    return false;
  }
};


// ============================================================================
// Other Helper Functions (from previous interactions)
// ============================================================================

interface GetProductsOptions {
  limit?: number;
  offset?: number;
}

export const getProducts = async (options?: GetProductsOptions) => {
  const { limit = 100, offset = 0 } = options || {};

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:product_categories ( id, name, slug ),
        brand:brands ( id, name, slug ),
        images:product_images ( id, image_url, display_order ),
        variants:product_variants ( id, name, sku, stock, price, color, size, color_hex, created_at, updated_at ),
        tags:products_tags(
          tag:tags(id, name, slug)
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase error fetching products:', error);
      throw new Error(error.message);
    }

    const products: ExtendedProduct[] = (data || []).map(product => ({
      ...product,
      category: product.category as ProductCategory | null,
      brand: product.brand as Brand | null,
      images: (product.images as ProductImageRow[]).sort((a, b) => a.display_order - b.display_order),
      variants: product.variants as ProductVariantRow[],
      tags: (product.tags as { tag: Database['public']['Tables']['tags']['Row'] }[]),
    }));

    return { products, error: null };

  } catch (err: any) {
    console.error('Error in getProducts service:', err);
    return { products: [], error: err };
  }
};

export const getProductCategories = async (): Promise<ProductCategory[]> => {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching product categories:', error);
    toast.error('Failed to load categories.');
    return [];
  }
  return data;
};

export const getBrands = async (): Promise<Brand[]> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching brands:', error);
    toast.error('Failed to load brands.');
    return [];
  }
  return data;
};


export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Supabase error deleting product:', error);
      toast.error(`Failed to delete product: ${error.message}`);
      return false;
    }

    toast.success('Product deleted successfully!');
    return true;

  } catch (err: any) {
    console.error('Error in deleteProduct service:', err);
    toast.error(`An unexpected error occurred during deletion: ${err.message}`);
    return false;
  }
};
