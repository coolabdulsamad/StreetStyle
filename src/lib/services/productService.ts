import { supabase } from "@/integrations/supabase/client";
import { Brand, ExtendedProduct, Product, ProductCategory, ProductReview } from "@/lib/types";
import { toast } from "sonner";

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
} = {}): Promise<{ products: ExtendedProduct[], count: number }> {
  try {
    let query = supabase
      .from('products' as any)
      .select(`
        *,
        category:category_id (
          id,
          name,
          slug
        ),
        brand:brand_id (
          id,
          name,
          slug,
          logo_url
        )
      `, { count: 'exact' });
    
    // Apply filters
    if (options.category) {
      const { data: categoryData } = await supabase
        .from('product_categories' as any)
        .select('id')
        .eq('slug', options.category)
        .single();
      
      if (categoryData) {
        query = query.eq('category_id', (categoryData as any).id);
      }
    }
    
    if (options.brand) {
      const { data: brandData } = await supabase
        .from('brands' as any)
        .select('id')
        .eq('slug', options.brand)
        .single();
      
      if (brandData) {
        query = query.eq('brand_id', (brandData as any).id);
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
      // Default sorting
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
    
    // Convert to expected type
    const productsData = (data || []) as unknown as ExtendedProduct[];
    
    // Get product images for each product
    const productsWithImages = await Promise.all(productsData.map(async (product) => {
      const { data: imageData, error: imageError } = await supabase
        .from('product_images' as any)
        .select('image_url')
        .eq('product_id', product.id)
        .order('display_order', { ascending: true });
      
      if (!imageError && imageData) {
        product.images = (imageData as any).map((item: any) => item.image_url);
      } else {
        product.images = [];
      }
      
      return product;
    }));
    
    // Check if user has any of these products in wishlist
    const { data: session } = await supabase.auth.getSession();
    if (session?.session?.user) {
      const userId = session.session.user.id;
      const { data: wishlistData } = await supabase
        .from('wishlists' as any)
        .select('product_id')
        .eq('user_id', userId);
      
      if (wishlistData) {
        const wishlistProductIds = new Set((wishlistData as any).map((item: any) => item.product_id));
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

// Fetch a single product by slug
export async function getProductBySlug(slug: string): Promise<ExtendedProduct | null> {
  try {
    const { data, error } = await supabase
      .from('products' as any)
      .select(`
        *,
        category:category_id (
          id,
          name,
          slug
        ),
        brand:brand_id (
          id,
          name,
          slug,
          logo_url,
          description
        )
      `)
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    
    const product = data as unknown as ExtendedProduct;
    
    // Get product images
    const { data: imageData, error: imageError } = await supabase
      .from('product_images' as any)
      .select('image_url')
      .eq('product_id', product.id)
      .order('display_order', { ascending: true });
    
    if (!imageError && imageData) {
      product.images = (imageData as any).map((item: any) => item.image_url);
    } else {
      product.images = [];
    }
    
    // Get product variants
    const { data: variantData, error: variantError } = await supabase
      .from('product_variants' as any)
      .select('*')
      .eq('product_id', product.id);
    
    if (!variantError && variantData) {
      product.variants = variantData as any;
    } else {
      product.variants = [];
    }
    
    // Get product reviews
    const { data: reviewData, error: reviewError } = await supabase
      .from('product_reviews' as any)
      .select(`
        *,
        user:user_id (
          id,
          email,
          profiles:profiles (
            first_name,
            last_name
          )
        )
      `)
      .eq('product_id', product.id)
      .order('created_at', { ascending: false });
    
    if (!reviewError && reviewData) {
      product.reviews = ((reviewData as any).map((review: any) => ({
        ...review,
        userName: review.user?.profiles?.[0]?.first_name 
          ? `${review.user.profiles[0].first_name} ${review.user.profiles[0].last_name || ''}`
          : 'Anonymous User'
      }))) as ProductReview[];
    } else {
      product.reviews = [];
    }
    
    // Check if product is in user's wishlist
    const { data: session } = await supabase.auth.getSession();
    if (session?.session?.user) {
      const userId = session.session.user.id;
      const { data: wishlistData } = await supabase
        .from('wishlists' as any)
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', product.id)
        .maybeSingle();
      
      product.is_in_wishlist = !!wishlistData;
    }
    
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    toast.error('Failed to load product details');
    return null;
  }
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  try {
    const { data, error } = await supabase
      .from('product_categories' as any)
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    
    return data as unknown as ProductCategory[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getBrands(): Promise<Brand[]> {
  try {
    const { data, error } = await supabase
      .from('brands' as any)
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return data as unknown as Brand[];
  } catch (error) {
    console.error('Error fetching brands:', error);
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
      .from('product_reviews' as any)
      .insert([{
        product_id: productId,
        rating,
        review_text,
        images
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Review submitted successfully!');
    return data as unknown as ProductReview;
  } catch (error: any) {
    console.error('Error adding review:', error);
    if (error.code === '23505') { // Unique constraint violation
      toast.error('You have already reviewed this product');
    } else {
      toast.error('Failed to submit review');
    }
    return null;
  }
}

export async function voteReviewHelpful(reviewId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('product_reviews' as any)
      .select('helpful_votes')
      .eq('id', reviewId)
      .single();
    
    if (error) throw error;
    
    const currentVotes = (data as any).helpful_votes || 0;
    
    const { error: updateError } = await supabase
      .from('product_reviews' as any)
      .update({ helpful_votes: currentVotes + 1 })
      .eq('id', reviewId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error voting review helpful:', error);
    return false;
  }
}
