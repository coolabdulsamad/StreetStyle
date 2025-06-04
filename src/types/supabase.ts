import { UUID } from "crypto"

[?25l
    Select a project:                                                                                                      
                                                                                                                           
  >  1. bprbvfgxsugwyywjadfo [name: supabase-orange-mountain, org: vercel_icfg_YcQrZ1i6PWWNm1TmQPXNh934, region: us-east-1]
    2. pytuyyhpzmekbsavanby [name: KickStreetdb, org: vercel_icfg_YcQrZ1i6PWWNm1TmQPXNh934, region: us-east-1]             
    3. mmeeioqrbehozwdjeauo [name: finalproject, org: vercel_icfg_YcQrZ1i6PWWNm1TmQPXNh934, region: us-east-1]             
                                                                                                                           
                                                                                                                           
                                                                                                                           
                                                                                                                           
                                                                                                                           
                                                                                                                           
    ↑/k up • ↓/j down • / filter • q quit • ? more                                                                         
                                                                                                                           [0D[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[0D[2K
    Select a project:                                                                                                     
                                                                                                                          
    1. bprbvfgxsugwyywjadfo [name: supabase-orange-mountain, org: vercel_icfg_YcQrZ1i6PWWNm1TmQPXNh934, region: us-east-1]
  >  2. pytuyyhpzmekbsavanby [name: KickStreetdb, org: vercel_icfg_YcQrZ1i6PWWNm1TmQPXNh934, region: us-east-1]           
    3. mmeeioqrbehozwdjeauo [name: finalproject, org: vercel_icfg_YcQrZ1i6PWWNm1TmQPXNh934, region: us-east-1]            
                                                                                                                          
                                                                                                                          
                                                                                                                          
                                                                                                                          
                                                                                                                          
                                                                                                                          
    ↑/k up • ↓/j down • / filter • q quit • ? more                                                                        
                                                                                                                          [0D[1A[1A[1A[1A[1A[1A[1A[1A[2K[1A[2K[1A[1A[1A[1A[0D[2K
[1B[1B[1B    2. pytuyyhpzmekbsavanby [name: KickStreetdb, org: vercel_icfg_YcQrZ1i6PWWNm1TmQPXNh934, region: us-east-1]            
  >  3. mmeeioqrbehozwdjeauo [name: finalproject, org: vercel_icfg_YcQrZ1i6PWWNm1TmQPXNh934, region: us-east-1]           
[1B[1B[1B[1B[1B[1B[1B[0D[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[0D[2K [0D[2K[?25h[?1002l[?1003l[?1006lexport type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cart_items: {
        Row: {
          added_at: string | null
          color: string | null
          id: number
          product_id: number
          quantity: number
          size: string | null
          user_id: number
        }
        Insert: {
          added_at?: string | null
          color?: string | null
          id?: number
          product_id: number
          quantity?: number
          size?: string | null
          user_id: number
        }
        Update: {
          added_at?: string | null
          color?: string | null
          id?: number
          product_id?: number
          quantity?: number
          size?: string | null
          user_id?: number
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          color: string | null
          id: number
          order_id: number
          price: number
          product_id: number
          quantity: number
          size: string | null
        }
        Insert: {
          color?: string | null
          id?: number
          order_id: number
          price: number
          product_id: number
          quantity: number
          size?: string | null
        }
        Update: {
          color?: string | null
          id?: number
          order_id?: number
          price?: number
          product_id?: number
          quantity?: number
          size?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          billing_address: string
          created_at: string | null
          id: number
          payment_method: string
          shipping_address: string
          status: string
          total: number
          user_id: number
        }
        Insert: {
          billing_address: string
          created_at?: string | null
          id?: number
          payment_method: string
          shipping_address: string
          status?: string
          total: number
          user_id: number
        }
        Update: {
          billing_address?: string
          created_at?: string | null
          id?: number
          payment_method?: string
          shipping_address?: string
          status?: string
          total?: number
          user_id?: number
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          product_id: string | null
        }
        Insert: {
          created_at?: string
          display_order: number
          id?: string
          image_url: string
          product_id?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          product_id?: string | null
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          price: number
          product_id: string | null
          size: string | null
          sku: string
          stock: number
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          price: number
          product_id?: string | null
          size?: string | null
          sku: string
          stock?: number
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          price?: number
          product_id?: string | null
          size?: string | null
          sku?: string
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string
          category: string
          colors: string[] | null
          created_at: string | null
          description: string
          id: number
          images: string[]
          is_limited: boolean | null
          is_new: boolean | null
          is_sale: boolean | null
          name: string
          original_price: number | null
          price: number
          rating: number | null
          review_count: number | null
          sizes: string[] | null
          stock_quantity: number
          sub_category: string | null
          tags: string[] | null
        }
        Insert: {
          brand: string
          category: string
          colors?: string[] | null
          created_at?: string | null
          description: string
          id?: number
          images: string[]
          is_limited?: boolean | null
          is_new?: boolean | null
          is_sale?: boolean | null
          name: string
          original_price?: number | null
          price: number
          rating?: number | null
          review_count?: number | null
          sizes?: string[] | null
          stock_quantity?: number
          sub_category?: string | null
          tags?: string[] | null
        }
        Update: {
          brand?: string
          category?: string
          colors?: string[] | null
          created_at?: string | null
          description?: string
          id?: number
          images?: string[]
          is_limited?: boolean | null
          is_new?: boolean | null
          is_sale?: boolean | null
          name?: string
          original_price?: number | null
          price?: number
          rating?: number | null
          review_count?: number | null
          sizes?: string[] | null
          stock_quantity?: number
          sub_category?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      products_tags: {
        Row: {
          product_id: string
          tag_id: string
        }
        Insert: {
          product_id: string
          tag_id: string
        }
        Update: {
          product_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: UUID
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: string | null
          rating: number
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
          rating: number
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
          rating?: number
          user_id?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          address_type: string | null
          city: string
          country: string
          created_at: string | null
          id: string
          is_default: boolean | null
          postal_code: string
          state: string
          street_address: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_type?: string | null
          city: string
          country: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          postal_code: string
          state: string
          street_address: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_type?: string | null
          city?: string
          country?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          postal_code?: string
          state?: string
          street_address?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: UUID | null
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: number
          last_name: string | null
          password: string
          phone: string | null
          state: string | null
          username: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: number
          last_name?: string | null
          password: string
          phone?: string | null
          state?: string | null
          username: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: number
          last_name?: string | null
          password?: string
          phone?: string | null
          state?: string | null
          username?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          added_at: string | null
          id: number
          product_id: number
          user_id: number
        }
        Insert: {
          added_at?: string | null
          id?: number
          product_id: number
          user_id: number
        }
        Update: {
          added_at?: string | null
          id?: number
          product_id?: number
          user_id?: number
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "customer"],
    },
  },
} as const
