import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { AddressesPageClient } from "./addresses-page-client"

export const metadata = {
  title: "Addresses",
  description: "Manage your shipping addresses.",
}

export default async function AddressesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session!.user!.id

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: "desc" },
  })

  return <AddressesPageClient addresses={addresses} userId={userId} />
}
