"use server"

import { prisma } from "@/lib/prisma"

export async function getOrderByNumber(orderNumber: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        shippingAddress: true,
      },
    })
    return order
  } catch {
    return null
  }
}

export async function getOrderById(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        shippingAddress: true,
      },
    })
    return order
  } catch {
    return null
  }
}

export async function getOrdersByUserId(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    })
    return orders
  } catch {
    return []
  }
}
