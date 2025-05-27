
import { Product } from '@/types/product';

// Define categories here to avoid circular dependencies
export const CATEGORIES = [
  {
    id: "1",
    name: "Sneakers",
    slug: "sneakers",
    description: "Premium streetwear sneakers",
    parent_id: null,
    image_url: null,
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: "2", 
    name: "Hoodies",
    slug: "hoodies",
    description: "Comfortable streetwear hoodies",
    parent_id: null,
    image_url: null,
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: "3",
    name: "T-Shirts", 
    slug: "t-shirts",
    description: "Stylish streetwear t-shirts",
    parent_id: null,
    image_url: null,
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString()
  }
];

export const extendedProducts: Product[] = [
  {
    id: "1",
    name: "Nike Air Jordan 1 Retro High",
    slug: "nike-air-jordan-1-retro-high",
    description: "The iconic Air Jordan 1 Retro High combines classic style with premium materials for a timeless look.",
    price: 170.00,
    images: [
      "https://images.unsplash.com/photo-1556048219-bb6978360b84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    category: CATEGORIES[0],
    tags: [
      { id: "1", name: "Basketball" },
      { id: "2", name: "Retro" },
      { id: "3", name: "High-top" }
    ],
    variants: [
      {
        id: "1-1",
        name: "US 8 - Black/Red",
        size: "8",
        color: "Black/Red",
        price: 170.00,
        stock: 15,
        sku: "AJ1-BR-8"
      },
      {
        id: "1-2", 
        name: "US 9 - Black/Red",
        size: "9",
        color: "Black/Red",
        price: 170.00,
        stock: 12,
        sku: "AJ1-BR-9"
      }
    ],
    featured: true,
    new: false,
    rating: 4.8,
    review_count: 245,
    brand_id: "nike-1",
    brand: "Nike",
    sku: "AJ1-RETRO-HIGH",
    gender: "unisex" as const,
    release_date: "2024-01-15",
    is_limited_edition: false,
    is_limited: false,
    is_sale: false,
    stock_quantity: 27,
    average_rating: 4.8,
    meta_title: "Nike Air Jordan 1 Retro High - Premium Basketball Sneakers",
    meta_description: "Shop the iconic Nike Air Jordan 1 Retro High. Premium basketball sneakers with classic style.",
    reviews: []
  },
  {
    id: "2",
    name: "Adidas Yeezy Boost 350 V2",
    slug: "adidas-yeezy-boost-350-v2",
    description: "The Yeezy Boost 350 V2 features a re-engineered Primeknit upper and innovative cushioning.",
    price: 220.00,
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    category: CATEGORIES[0],
    tags: [
      { id: "4", name: "Boost" },
      { id: "5", name: "Yeezy" },
      { id: "6", name: "Limited" }
    ],
    variants: [
      {
        id: "2-1",
        name: "US 8.5 - Zebra",
        size: "8.5",
        color: "Zebra",
        price: 220.00,
        stock: 8,
        sku: "YZ350-ZB-8.5"
      },
      {
        id: "2-2",
        name: "US 9.5 - Zebra", 
        size: "9.5",
        color: "Zebra",
        price: 220.00,
        stock: 5,
        sku: "YZ350-ZB-9.5"
      }
    ],
    featured: true,
    new: true,
    rating: 4.9,
    review_count: 189,
    brand_id: "adidas-1",
    brand: "Adidas",
    sku: "YZ350-V2-ZEBRA",
    gender: "unisex" as const,
    release_date: "2024-02-01",
    is_limited_edition: true,
    is_limited: true,
    is_sale: false,
    stock_quantity: 13,
    average_rating: 4.9,
    meta_title: "Adidas Yeezy Boost 350 V2 - Limited Edition Sneakers",
    meta_description: "Shop the limited edition Adidas Yeezy Boost 350 V2. Premium comfort meets iconic style.",
    reviews: []
  },
  {
    id: "3",
    name: "Supreme Box Logo Hoodie",
    slug: "supreme-box-logo-hoodie",
    description: "The iconic Supreme Box Logo Hoodie in premium cotton fleece construction.",
    price: 158.00,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    category: CATEGORIES[1],
    tags: [
      { id: "7", name: "Box Logo" },
      { id: "8", name: "Cotton" },
      { id: "9", name: "Classic" }
    ],
    variants: [
      {
        id: "3-1",
        name: "Medium - Black",
        size: "M",
        color: "Black",
        price: 158.00,
        stock: 20,
        sku: "SUP-BL-M-BK"
      },
      {
        id: "3-2",
        name: "Large - Black",
        size: "L", 
        color: "Black",
        price: 158.00,
        stock: 18,
        sku: "SUP-BL-L-BK"
      }
    ],
    featured: false,
    new: false,
    rating: 4.7,
    review_count: 156,
    brand_id: "supreme-1",
    brand: "Supreme",
    sku: "SUP-BOX-LOGO-HD",
    gender: "unisex" as const,
    release_date: "2023-12-10",
    is_limited_edition: false,
    is_limited: false,
    is_sale: true,
    stock_quantity: 38,
    average_rating: 4.7,
    meta_title: "Supreme Box Logo Hoodie - Iconic Streetwear",
    meta_description: "Shop the iconic Supreme Box Logo Hoodie. Premium cotton fleece construction.",
    reviews: []
  },
  {
    id: "4",
    name: "Off-White Diagonal T-Shirt",
    slug: "off-white-diagonal-t-shirt",
    description: "Off-White's signature diagonal stripes T-shirt in premium cotton construction.",
    price: 89.00,
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f37f518b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    category: CATEGORIES[2],
    tags: [
      { id: "10", name: "Diagonal" },
      { id: "11", name: "Cotton" },
      { id: "12", name: "Designer" }
    ],
    variants: [
      {
        id: "4-1",
        name: "Small - White",
        size: "S",
        color: "White",
        price: 89.00,
        stock: 25,
        sku: "OW-DG-S-WH"
      },
      {
        id: "4-2",
        name: "Medium - White",
        size: "M",
        color: "White", 
        price: 89.00,
        stock: 22,
        sku: "OW-DG-M-WH"
      }
    ],
    featured: false,
    new: true,
    rating: 4.6,
    review_count: 78,
    brand_id: "off-white-1",
    brand: "Off-White",
    sku: "OW-DIAGONAL-TEE",
    gender: "unisex" as const,
    release_date: "2024-01-20",
    is_limited_edition: false,
    is_limited: false,
    is_sale: false,
    stock_quantity: 47,
    average_rating: 4.6,
    meta_title: "Off-White Diagonal T-Shirt - Designer Streetwear",
    meta_description: "Shop the Off-White Diagonal T-Shirt. Signature diagonal stripes in premium cotton.",
    reviews: []
  }
];
