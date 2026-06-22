import { z } from "zod"

export const emailSchema = z.string().email("Invalid email address").max(255)

export const addressSchema = z.object({
  label: z.string().max(100).optional(),
  line1: z.string().min(1, "Address is required").max(255),
  line2: z.string().max(255).optional(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().min(1, "Postal code is required").max(20),
  country: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  isDefault: z.boolean().optional(),
})

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().nullable().optional(),
  name: z.string().min(1).max(500),
  price: z.number().min(0),
  quantity: z.number().int().min(1).max(999),
  image: z.string().nullable().optional(),
})

export const createOrderSchema = z.object({
  email: emailSchema,
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  address1: z.string().min(1, "Address is required").max(255),
  address2: z.string().max(255).optional(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  postalCode: z.string().min(1, "Postal code is required").max(20),
  country: z.string().min(1, "Country is required").max(100),
  phone: z.string().max(20).optional(),
  shippingMethod: z.string().min(1).max(100),
  notes: z.string().max(1000).optional(),
  paymentIntentId: z.string().min(1),
  items: z.array(orderItemSchema).min(1).max(100),
  subtotal: z.number().min(0),
  shippingCost: z.number().min(0),
  taxAmount: z.number().min(0),
  discountAmount: z.number().min(0),
  total: z.number().min(0),
  couponId: z.string().optional(),
  userId: z.string().optional(),
})

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1, "Title is required").max(200),
  body: z.string().min(1, "Review is required").max(5000),
  images: z.array(z.string().url()).max(5).optional(),
})

export const newsletterSchema = z.object({
  email: emailSchema,
})

export const couponSchema = z.object({
  code: z.string().min(1).max(50),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().min(0),
  minOrderAmount: z.number().min(0).optional(),
  maxUses: z.number().int().min(0).optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean().optional(),
})

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(500),
  slug: z.string().min(1).max(500),
  description: z.string().min(1).max(50000),
  shortDescription: z.string().max(500).optional(),
  price: z.number().min(0),
  comparePrice: z.number().min(0).optional().nullable(),
  sku: z.string().max(100).optional(),
  barcode: z.string().max(100).optional(),
  stock: z.number().int().min(0),
  weight: z.number().min(0).optional().nullable(),
  dimensions: z.string().max(100).optional(),
  material: z.string().max(200).optional(),
  countryOfOrigin: z.string().max(100).optional(),
  warrantyInfo: z.string().max(500).optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNew: z.boolean().optional(),
  categoryIds: z.array(z.string()).optional(),
  collectionIds: z.array(z.string()).optional(),
})

export const searchQuerySchema = z.object({
  query: z.string().min(1).max(500),
})

export const cartRecommendationsSchema = z.object({
  productIds: z.array(z.string()).min(1).max(50),
})
