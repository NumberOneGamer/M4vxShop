export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  icon: string | null
  sortOrder: number
  _count?: {
    products: number
  }
}
