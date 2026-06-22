export interface CartItemType {
  id: string
  productId: string
  variantId: string | null
  name: string
  price: number
  comparePrice: number | null
  quantity: number
  image: string | null
  imageAlt: string | null
  slug: string
  stock: number
  variantName: string | null
}

export interface CartCoupon {
  code: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minOrderAmount: number | null
}

export interface CartShippingOption {
  id: string
  label: string
  cost: number
  estimatedDays: string
}

export interface CartState {
  items: CartItemType[]
  coupon: CartCoupon | null
  shipping: CartShippingOption | null
  isOpen: boolean
}
