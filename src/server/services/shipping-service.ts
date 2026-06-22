export interface ShippingRate {
  id: string
  label: string
  cost: number
  estimatedDays: string
}

const SHIPPING_RATES: ShippingRate[] = [
  { id: "standard", label: "Standard Shipping", cost: 5.99, estimatedDays: "5–8 business days" },
  { id: "express", label: "Express Shipping", cost: 12.99, estimatedDays: "2–3 business days" },
  { id: "priority", label: "Priority Shipping", cost: 19.99, estimatedDays: "1–2 business days" },
]

export function getShippingRates(): ShippingRate[] {
  return SHIPPING_RATES
}

export function getShippingRate(id: string): ShippingRate | undefined {
  return SHIPPING_RATES.find((r) => r.id === id)
}

export function calculateShippingCost(subtotal: number, methodId?: string): number {
  if (!methodId) return 0
  if (subtotal >= 100) return 0
  const rate = getShippingRate(methodId)
  return rate?.cost ?? 0
}

export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * 0.08 * 100) / 100
}
