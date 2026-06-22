"use client"

import { useRouter } from "next/navigation"
import { AddressBook } from "@/components/account/address-book"
import { createAddress, updateAddress, deleteAddress, type AddressFormData } from "@/server/actions/address-actions"

interface Address {
  id: string
  label: string | null
  line1: string
  line2: string | null
  city: string
  state: string | null
  postalCode: string
  country: string
  phone: string | null
  isDefault: boolean
}

interface AddressesPageClientProps {
  addresses: Address[]
  userId: string
}

export function AddressesPageClient({ addresses: initial, userId }: AddressesPageClientProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    await deleteAddress(id)
    router.refresh()
  }

  const handleSetDefault = async (id: string) => {
    await updateAddress(id, userId, { isDefault: true, line1: "", city: "", postalCode: "" } as AddressFormData)
    router.refresh()
  }

  const handleSave = async (data: {
    id?: string
    label?: string
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode: string
    phone?: string
    isDefault?: boolean
  }) => {
    if (data.id) {
      await updateAddress(data.id, userId, data)
    } else {
      await createAddress(userId, data)
    }
    router.refresh()
  }

  return (
    <AddressBook
      addresses={initial}
      onDelete={handleDelete}
      onSetDefault={handleSetDefault}
      onSave={handleSave}
    />
  )
}
