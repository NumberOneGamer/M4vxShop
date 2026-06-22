import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { WishlistPageClient } from "./wishlist-page-client"

export const metadata = {
  title: "Wishlist",
  description: "Your saved items.",
}

export default async function WishlistPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session!.user!.id

  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      product: {
        include: { images: { where: { isPrimary: true }, take: 1 } },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const wishlistItems = items.map((item) => ({
    productId: item.productId,
    name: item.product.name,
    price: Number(item.product.price),
    image: item.product.images[0]?.url ?? null,
    slug: item.product.slug,
  }))

  return <WishlistPageClient items={wishlistItems} userId={userId} />
}
