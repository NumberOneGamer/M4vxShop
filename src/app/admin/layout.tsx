import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminNavbar } from "@/components/admin/admin-navbar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect("/login?redirect=/admin")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar user={{ name: session.user.name, email: session.user.email ?? "" }} />
      <div className="flex">
        <AdminSidebar />
        <main id="main-content" className="flex-1 p-6 md:p-8 pt-6 md:ml-64">
          {children}
        </main>
      </div>
    </div>
  )
}
