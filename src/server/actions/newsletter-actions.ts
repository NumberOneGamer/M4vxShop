"use server"

import { prisma } from "@/lib/prisma"
import { emailSchema } from "@/lib/validations"

export async function subscribeToNewsletter(
  email: string
): Promise<{ success: boolean; message: string }> {
  const parsed = emailSchema.safeParse(email)
  if (!parsed.success) {
    return { success: false, message: "Invalid email address" }
  }

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: parsed.data },
    })

    if (existing) {
      return { success: false, message: "Already subscribed" }
    }

    await prisma.newsletterSubscriber.create({
      data: { email: parsed.data },
    })

    return { success: true, message: "Thanks for subscribing!" }
  } catch {
    return { success: false, message: "Something went wrong. Try again." }
  }
}
