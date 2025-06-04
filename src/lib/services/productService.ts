// @/services/productService.ts
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Brand, Product, ProductCategory, ProductReview, ProductVariant, ProductImage } from "@/lib/types"; // Import ProductImage
import { toast } from "sonner";

// Helper type to represent the raw data shape from Supabase SELECT queries before transformation
type ProductRowWithRelations = Database['public']['Tables']['products']['Row'] & {
  category: Database['public']['Tables']['product_categories']['Row'] | null;
  brand: Database['public']['Tables']['brands']['Row'] | null;
  // Remove direct 'images' and 'tags' from this type if they are fetched separately/mapped later
  // If you decide to fetch them directly with the main product query, then add them here.
  // For now, we'll fetch images in getProductImages.
};

// Helper function to fetch product images
// This will now return an array of ProductImage objects, not just strings
async function getProductImages(productId: string): Promise<ProductImage[]> {
  const { data, error } = await supabase
    .from('product_images')
    .select('*') // <--- CHANGED: Select all fields to get the object structure
    .eq('product_id', productId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error(`Error fetching images for product ${productId}:`, error.message);
    return [];
  }
  // Ensure the data is cast to ProductImage[]
  return (data as ProductImage[]) || [];
}

// Helper function to transform raw Supabase product data into our frontend Product type
function transformProductData(
  productRow: ProductRowWithRelations,
  images: ProductImage[], // <--- CHANGED: Expect ProductImage[]
  variants: ProductVariant[] = [],
  reviews: ProductReview[] = [],
  is_in_wishlist: boolean = false
): Product {
  return {
    id: productRow.id,
    name: productRow.name,
    slug: productRow.slug,
    description: productRow.description,
    price: productRow.price,
    images: images, // Assign the ProductImage[] directly
    category: productRow.category ? {
      id: productRow.category.id,
      name: productRow.category.name,
      slug: productRow.category.slug,
      description: productRow.category.description || null,
      parent_id: productRow.category.parent_id || null,
      image_url: productRow.category.image_url || null,
      is_active: productRow.category.is_active || false,
      display_order: productRow.category.display_order || 0,
      created_at: productRow.category.created_at,
    } : null,
    brand: productRow.brand ? {
      id: productRow.brand.id,
      name: productRow.brand.name,
      slug: productRow.brand.slug,
      logo_url: productRow.brand.logo_url || null,
      description: productRow.brand.description || null,
      is_active: productRow.brand.is_active || false,
      created_at: productRow.brand.created_at,
    } : null,
    tags: [], // Tags need to be fetched/transformed separately or joined in the main query if desired
    variants: variants,
    featured: productRow.featured,
    is_new: productRow.is_new,
    rating: productRow.average_rating,
    reviews: reviews,

    brand_id: productRow.brand_id,
    sku: productRow.sku,
    gender: productRow.gender,
    release_date: productRow.release_date,
    is_limited_edition: productRow.is_limited_edition,
    average_rating: productRow.average_rating,
    review_count: productRow.review_count,
    meta_title: productRow.meta_title,
    meta_description: productRow.meta_description,
    created_at: productRow.created_at,
    updated_at: productRow.updated_at,
    is_in_wishlist: is_in_wishlist,
  };
}

// Fetch all products with category information
export async function getProducts(options: {
  category?: string;
  brand?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isLimitedEdition?: boolean;
  searchQuery?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ products: Product[], count: number }> {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        category:category_id (
          id, name, slug, is_active, display_order, created_at, description, parent_id, image_url
        ),
        brand:brand_id (
          id, name, slug, logo_url, description, is_active, created_at
        )
      `, { count: 'exact' });

    // Apply filters (logic remains the same, but ensure 'is_new' and 'featured' match DB columns)
    if (options.category) {
      const { data: categoryData } = await supabase
        .from('product_categories')
        .select('id')
        .eq('slug', options.category)
        .single();
      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      }
    }
    if (options.brand) {
      const { data: brandData } = await supabase
        .from('brands')
        .select('id')
        .eq('slug', options.brand)
        .single();
      if (brandData) {
        query = query.eq('brand_id', brandData.id);
      }
    }
    if (options.gender) {
      query = query.eq('gender', options.gender);
    }
    if (options.minPrice !== undefined) {
      query = query.gte('price', options.minPrice);
    }
    if (options.maxPrice !== undefined) {
      query = query.lte('price', options.maxPrice);
    }
    if (options.isNew !== undefined) {
      query = query.eq('is_new', options.isNew);
    }
    if (options.isFeatured !== undefined) {
      query = query.eq('featured', options.isFeatured);
    }
    if (options.isLimitedEdition !== undefined) {
      query = query.eq('is_limited_edition', options.isLimitedEdition);
    }
    if (options.searchQuery) {
      query = query.or(`name.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`);
    }

    // Apply sorting
    if (options.sortBy) {
      switch (options.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('release_date', { ascending: false });
          break;
        case 'rating':
          query = query.order('average_rating', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    const page = options.page || 1;
    const limit = options.limit || 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Execute the query
    const { data, error, count } = await query;
    if (error) throw error;

    // Process products: fetch images and check wishlist status in parallel
    const productsPromises = (data || []).map(async (productRow) => {
      // Fetch images separately as full objects
      const images = await getProductImages(productRow.id);
      return transformProductData(productRow as ProductRowWithRelations, images);
    });

    const productsWithImages = await Promise.all(productsPromises);

    // Check if user has any of these products in wishlist
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (userId) {
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', userId);

      if (wishlistError) {
        console.error('Error fetching wishlist for products:', wishlistError.message);
      } else if (wishlistData) {
        const wishlistProductIds = new Set(wishlistData.map(item => item.product_id));
        productsWithImages.forEach(product => {
          product.is_in_wishlist = wishlistProductIds.has(product.id);
        });
      }
    }

    return {
      products: productsWithImages,
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    toast.error('Failed to load products');
    return { products: [], count: 0 };
  }
}

// --- NEWLY ADDED HELPER FUNCTIONS FOR HOMEPAGE (if not already existing) ---

/**
 * Fetches featured products using the getProducts function.
 * @param limit The maximum number of featured products to fetch. Defaults to 8.
 */
export async function getFeaturedProductsService(limit: number = 8): Promise<Product[]> {
  const { products } = await getProducts({ isFeatured: true, limit: limit });
  return products;
}

/**
 * Fetches new arrival products using the getProducts function.
 * @param limit The maximum number of new products to fetch. Defaults to 8.
 */
export async function getNewProductsService(limit: number = 8): Promise<Product[]> {
  // Use sortBy: 'newest' which internally sorts by release_date
  const { products } = await getProducts({ isNew: true, sortBy: 'newest', limit: limit });
  return products;
}

// --- END NEWLY ADDED HELPER FUNCTIONS ---


// Fetch a single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:category_id (
          id, name, slug, description, parent_id, image_url, is_active, display_order, created_at
        ),
        brand:brand_id (
          id, name, slug, logo_url, description, is_active, created_at
        )
      `)
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return null;
      }
      console.error(`Supabase error fetching product by slug ${slug}:`, error.message);
      throw error;
    }

    if (!data) return null;

    const productRow = data as ProductRowWithRelations;

    // Get product images, variants, and reviews in parallel
    const [images, variants, reviewsRaw] = await Promise.all([
      getProductImages(productRow.id), // <--- Use the updated getProductImages
      supabase.from('product_variants').select('*').eq('product_id', productRow.id).then(res => res.data || []),
      supabase.from('product_reviews').select(`
        *,
        user:user_id (
          id,
          email,
          profiles:profiles (
            first_name,
            last_name
          )
        )
      `).eq('product_id', productRow.id).order('created_at', { ascending: false }).then(res => res.data || [])
    ]);

    // Map raw review data to ProductReview type
    const reviews: ProductReview[] = (reviewsRaw as any[]).map(review => ({
      ...review,
      userName: review.user?.profiles?.[0]?.first_name
        ? `${review.user.profiles[0].first_name} ${review.user.profiles[0].last_name || ''}`.trim()
        : 'Anonymous User'
    }));

    // Check if product is in user's wishlist
    let is_in_wishlist = false;
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (userId) {
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productRow.id)
        .maybeSingle();

      if (wishlistError) {
        console.error('Error checking wishlist status for single product:', wishlistError.message);
      } else {
        is_in_wishlist = !!wishlistData; // Convert to boolean
      }
    }

    return transformProductData(productRow, images, variants as ProductVariant[], reviews, is_in_wishlist);
  } catch (error) {
    console.error('Error fetching product:', error);
    toast.error('Failed to load product details');
    return null;
  }
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;

    return data as ProductCategory[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    toast.error('Failed to load product categories.');
    return [];
  }
}

export async function getBrands(): Promise<Brand[]> {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;

    return data as Brand[];
  } catch (error) {
    console.error('Error fetching brands:', error);
    toast.error('Failed to load brands.');
    return [];
  }
}

export async function addProductReview(
  productId: string,
  rating: number,
  review_text?: string,
  images?: string[]
): Promise<ProductReview | null> {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .insert([{
        product_id: productId,
        rating,
        review_text: review_text || null,
        images: images || null
      }])
      .select()
      .single();

    if (error) throw error;

    toast.success('Review submitted successfully!');
    return data as ProductReview;
  } catch (error: any) {
    console.error('Error adding review:', error);
    if (error.code === '23505') {
      toast.error('You have already reviewed this product.');
    } else {
      toast.error(error.message || 'Failed to submit review.');
    }
    return null;
  }
}

export async function voteReviewHelpful(reviewId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .select('helpful_votes')
      .eq('id', reviewId)
      .single();

    if (error) throw error;

    const currentVotes = data?.helpful_votes || 0;

    const { error: updateError } = await supabase
      .from('product_reviews')
      .update({ helpful_votes: currentVotes + 1 })
      .eq('id', reviewId);

    if (updateError) throw updateError;

    toast.success('Vote recorded!');
    return true;
  } catch (error) {
    console.error('Error voting review helpful:', error);
    toast.error('Failed to record vote.');
    return false;
  }
}