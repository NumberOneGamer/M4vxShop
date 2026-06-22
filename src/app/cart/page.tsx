import { CartPageClient } from "./cart-page-client"

export const metadata = {
  title: "Shopping Cart",
  description: "Review and manage your cart items before checkout.",
  alternates: { canonical: "/cart" },
}

export default function CartPage() {
  return <CartPageClient />
}
