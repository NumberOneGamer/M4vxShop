export interface ShopProduct {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  image: string | null
  imageAlt: string | null
  averageRating: number
  reviewCount: number
  isNew: boolean
  categories: { slug: string; name: string }[]
}

export interface ShopFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  sort?: "newest" | "price-asc" | "price-desc" | "rating"
  page?: number
}

export interface ShopSearchResult {
  products: ShopProduct[]
  totalCount: number
  totalPages: number
  currentPage: number
}
