export interface FeaturedProduct {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  price: number
  comparePrice: number | null
  image: string | null
  imageAlt: string | null
}

export interface BestSellerProduct {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  image: string | null
  imageAlt: string | null
  averageRating: number
  reviewCount: number
}

export interface ProductDetailImage {
  id: string
  url: string
  alt: string | null
  width: number | null
  height: number | null
  isPrimary: boolean
  sortOrder: number
}

export interface ProductDetailVideo {
  id: string
  url: string
  thumbnail: string | null
  sortOrder: number
}

export interface ProductDetailVariant {
  id: string
  name: string
  sku: string | null
  price: number | null
  stock: number
  sortOrder: number
}

export interface ProductDetailReview {
  id: string
  rating: number
  title: string | null
  body: string | null
  images: string[]
  isVerified: boolean
  helpfulCount: number
  user: {
    name: string | null
    image: string | null
  }
}

export interface ProductDetail {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string | null
  price: number
  comparePrice: number | null
  sku: string | null
  barcode: string | null
  stock: number
  isNew: boolean
  isFeatured: boolean
  isBestSeller: boolean
  weight: number | null
  dimensions: string | null
  material: string | null
  countryOfOrigin: string | null
  warrantyInfo: string | null
  metaTitle: string | null
  metaDescription: string | null
  images: ProductDetailImage[]
  videos: ProductDetailVideo[]
  variants: ProductDetailVariant[]
  categories: { slug: string; name: string }[]
  reviews: ProductDetailReview[]
  averageRating: number
  reviewCount: number
}
