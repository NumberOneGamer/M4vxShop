import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Container } from "@/components/layout/container"
import { AccountSidebar } from "./account-sidebar"

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect("/login?redirect=/account")
  }

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-6 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <AccountSidebar user={session.user} />
          </aside>
          <main id="main-content" className="md:col-span-3">{children}</main>
        </div>
      </Container>
    </div>
  )
}
