"use client"

import { useRouter } from "next/navigation"
import { ProfileForm } from "@/components/account/profile-form"
import { authClient } from "@/lib/auth-client"

interface SettingsPageClientProps {
  defaultValues: { name: string; email: string }
}

export function SettingsPageClient({ defaultValues }: SettingsPageClientProps) {
  const router = useRouter()

  const handleSave = async (data: { name: string; email: string; phone?: string }) => {
    await authClient.updateUser({ name: data.name })
    router.refresh()
  }

  const handleChangePassword = async (data: { currentPassword: string; newPassword: string }) => {
    await authClient.changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
  }

  return (
    <ProfileForm
      defaultValues={defaultValues}
      onSave={handleSave}
      onChangePassword={handleChangePassword}
    />
  )
}
