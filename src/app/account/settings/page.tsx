import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { SettingsPageClient } from "./settings-page-client"

export const metadata = {
  title: "Account Settings",
  description: "Manage your account settings.",
}

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session!.user!

  return (
    <SettingsPageClient
      defaultValues={{
        name: user.name ?? "",
        email: user.email,
      }}
    />
  )
}
