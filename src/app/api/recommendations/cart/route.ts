import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getRecommendationsForCart } from "@/server/services/recommendation-service"
import { rateLimitByIp } from "@/lib/rate-limit"
import { cartRecommendationsSchema } from "@/lib/validations"

export async function POST(req: NextRequest) {
  const rl = rateLimitByIp(req, { interval: 60000, maxRequests: 60 })
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const body = await req.json()
    const parsed = cartRecommendationsSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ products: [] })
    }

    const { productIds } = parsed.data

    const cartProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
      },
    })

    const cartItems = cartProducts.map((p) => ({
      id: p.id,
      productId: p.id,
      variantId: null,
      name: p.name,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      quantity: 1,
      image: p.images[0]?.url ?? null,
      imageAlt: p.images[0]?.alt ?? p.name,
      slug: p.slug,
      stock: p.stock,
      variantName: null,
    }))

    const products = await getRecommendationsForCart(cartItems, 4)

    return NextResponse.json({ products })
  } catch {
    return NextResponse.json({ products: [] })
  }
}
