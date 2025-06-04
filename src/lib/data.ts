import { Product, Category, ProductTag, ProductImage, Brand, Review, ProductVariant } from '@/lib/types'; // Import ProductVariant
import { supabase } from '@/integrations/supabase/client';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';

// Helper function to map fetched product data to the Product type
// This handles the nested relations and ensures defaults for potentially null fields.
const mapProductData = (data: any): Product => {
    const mappedProduct: Product = {
        id: data.id,
        name: data.name || '',
        slug: data.slug || '',
        description: data.description || '',
        price: data.price || 0,
        original_price: data.original_price || null,
        rating: data.average_rating || null,
        review_count: data.review_count || 0,
        sku: data.sku || null,
        gender: data.gender || null,
        release_date: data.release_date || null,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        is_sale: data.is_sale ?? false,
        is_new: data.is_new ?? false,
        is_limited_edition: data.is_limited_edition ?? false,
        featured: data.featured ?? false,
        stock_quantity: data.stock_quantity || 0,
        brand_id: data.brand_id,
        category_id: data.category_id,

        brand: data.brand || null,
        category: data.category || null,
        tags: data.tags?.map((pt: { tag: ProductTag }) => pt.tag) || [],
        images: Array.isArray(data.images)
            ? data.images.map((image: ProductImage) => ({
                  id: image.id,
                  image_url: image.image_url,
                  created_at: image.created_at,
                  display_order: image.display_order,
                  product_id: image.product_id,
              }))
            : [],
        reviews: data.reviews || [],

        // **FIX HERE: Map product_variants data, including color and color_hex**
        variants: Array.isArray(data.product_variants)
            ? data.product_variants.map((variant: ProductVariant) => ({
                  id: variant.id,
                  product_id: variant.product_id,
                  size: variant.size,
                  price: variant.price,
                  stock: variant.stock,
                  sku_suffix: variant.sku_suffix || null,
                  color: variant.color || null, // <--- ADD THIS LINE
                  color_hex: variant.color_hex || null, // <--- ADD THIS LINE
                  created_at: variant.created_at,
                  updated_at: variant.updated_at,
              }))
            : [],
    };
    return mappedProduct;
};

// Export mapProductData so it can be used in other files (like ProductListPage)
export { mapProductData };

export const getProduct = async (slug?: string): Promise<Product | null> => {
    if (!slug) return null;

    try {
        const { data, error }: PostgrestSingleResponse<any> = await supabase
            .from('products')
            .select(`
                *,
                brand:brands(*),
                category:product_categories(*),
                tags:products_tags(tag:tags(*)),
                images:product_images(*),
                reviews:product_reviews(*),
                product_variants(*) -- **NEW: Select product_variants here**
            `)
            .eq('slug', slug)
            .eq('is_sale', true) // Or 'is_active', depending on your column for active products
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means "No rows found"
            console.error('Error fetching product by slug:', error);
            throw new Error(error.message);
        }

        if (!data) {
            return null; // Product not found
        }

        return mapProductData(data);

    } catch (error) {
        console.error('Error in getProduct:', error);
        return null;
    }
};

export const getProductsByCategory = async (categorySlug?: string): Promise<Product[]> => {
    try {
        let query = supabase
            .from('products')
            .select(`
                *,
                brand:brands(*),
                category:product_categories(*),
                tags:products_tags(tag:tags(*)),
                images:product_images(*),
                product_variants(*) -- **NEW: Select product_variants here**
            `)
            .eq('is_sale', true)
            .order('created_at', { ascending: false });

        if (categorySlug) {
            const { data: categoryData, error: categoryError }: PostgrestSingleResponse<{ id: string }> = await supabase
                .from('product_categories')
                .select('id')
                .eq('slug', categorySlug)
                .single();

            if (categoryError || !categoryData) {
                console.warn(`Category with slug "${categorySlug}" not found or error:`, categoryError?.message);
                return [];
            }

            query = query.eq('category_id', categoryData.id);
        }

        const { data, error }: PostgrestResponse<any> = await query;

        if (error) {
            console.error('Error fetching products by category:', error);
            throw new Error(error.message);
        }

        return data.map(mapProductData);

    } catch (error) {
        console.error('Error in getProductsByCategory:', error);
        return [];
    }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
    try {
        const { data, error }: PostgrestResponse<any> = await supabase
            .from('products')
            .select(`
                *,
                brand:brands(*),
                category:product_categories(*),
                tags:products_tags(tag:tags(*)),
                images:product_images(*),
                product_variants(*) -- **NEW: Select product_variants here**
            `)
            .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
            .eq('is_sale', true);

        if (error) {
            console.error('Error searching products:', error);
            throw new Error(error.message);
        }

        return data.map(mapProductData);

    } catch (error) {
        console.error('Error in searchProducts:', error);
        return [];
    }
};

export const getRelatedProducts = async (productId: string, categoryId: string): Promise<Product[]> => {
    try {
        const { data, error }: PostgrestResponse<any> = await supabase
            .from('products')
            .select(`
                *,
                brand:brands(*),
                category:product_categories(*),
                tags:products_tags(tag:tags(*)),
                images:product_images(*),
                product_variants(*) -- **NEW: Select product_variants here**
            `)
            .eq('category_id', categoryId)
            .neq('id', productId)
            .eq('is_sale', true)
            .limit(4)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching related products:', error);
            throw new Error(error.message);
        }

        return data.map(mapProductData);

    } catch (error) {
        console.error('Error in getRelatedProducts:', error);
        return [];
    }
};

export const getPopularProducts = async (): Promise<Product[]> => {
    try {
        const { data, error }: PostgrestResponse<any> = await supabase
            .from('products')
            .select(`
                *,
                brand:brands(*),
                category:product_categories(*),
                tags:products_tags(tag:tags(*)),
                images:product_images(*),
                product_variants(*) -- **NEW: Select product_variants here**
            `)
            .eq('is_sale', true)
            .order('review_count', { ascending: false, nullsFirst: false })
            .order('average_rating', { ascending: false, nullsFirst: false })
            .limit(6);

        if (error) {
            console.error('Error fetching popular products:', error);
            throw new Error(error.message);
        }

        return data.map(mapProductData);

    } catch (error) {
        console.error('Error in getPopularProducts:', error);
        return [];
    }
};