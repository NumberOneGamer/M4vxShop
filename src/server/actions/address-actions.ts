"use server"

import { prisma } from "@/lib/prisma"
import { addressSchema } from "@/lib/validations"

export interface AddressFormData {
  label?: string
  line1: string
  line2?: string
  city: string
  state?: string
  postalCode: string
  country?: string
  phone?: string
  isDefault?: boolean
}

export async function getUserAddresses(userId: string) {
  try {
    return await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" },
    })
  } catch {
    return []
  }
}

export async function createAddress(userId: string, data: AddressFormData) {
  const parsed = addressSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Invalid address data" }
  }

  try {
    if (parsed.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }
    const address = await prisma.address.create({
      data: {
        userId,
        label: parsed.data.label,
        line1: parsed.data.line1,
        line2: parsed.data.line2,
        city: parsed.data.city,
        state: parsed.data.state,
        postalCode: parsed.data.postalCode,
        country: parsed.data.country ?? "US",
        phone: parsed.data.phone,
        isDefault: parsed.data.isDefault ?? false,
      },
    })
    return { success: true, address }
  } catch {
    return { error: "Failed to create address" }
  }
}

export async function updateAddress(id: string, userId: string, data: AddressFormData) {
  const parsed = addressSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Invalid address data" }
  }

  try {
    if (parsed.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }
    const address = await prisma.address.update({
      where: { id },
      data: {
        label: parsed.data.label,
        line1: parsed.data.line1,
        line2: parsed.data.line2,
        city: parsed.data.city,
        state: parsed.data.state,
        postalCode: parsed.data.postalCode,
        country: parsed.data.country ?? "US",
        phone: parsed.data.phone,
        isDefault: parsed.data.isDefault ?? false,
      },
    })
    return { success: true, address }
  } catch {
    return { error: "Failed to update address" }
  }
}

export async function deleteAddress(id: string) {
  try {
    await prisma.address.delete({ where: { id } })
    return { success: true }
  } catch {
    return { error: "Failed to delete address" }
  }
}
