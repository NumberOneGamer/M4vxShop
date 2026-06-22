"use server"

import { prisma } from "@/lib/prisma"

export async function getCartFromDb(userId: string) {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                comparePrice: true,
                stock: true,
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
            variant: {
              select: { id: true, name: true, price: true, stock: true },
            },
          },
        },
        coupon: true,
      },
    })

    if (!cart) return null

    return {
      items: cart.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        name: item.product.name,
        price: Number(item.variant?.price ?? item.product.price),
        comparePrice: item.product.comparePrice ? Number(item.product.comparePrice) : null,
        quantity: item.quantity,
        image: item.product.images[0]?.url ?? null,
        imageAlt: item.product.images[0]?.alt ?? item.product.name,
        slug: item.product.slug,
        stock: item.variant?.stock ?? item.product.stock,
        variantName: item.variant?.name ?? null,
      })),
      coupon: cart.coupon
        ? {
            code: cart.coupon.code,
            discountType: cart.coupon.discountType as "percentage" | "fixed",
            discountValue: Number(cart.coupon.discountValue),
            minOrderAmount: cart.coupon.minOrderAmount ? Number(cart.coupon.minOrderAmount) : null,
          }
        : null,
    }
  } catch {
    return null
  }
}
