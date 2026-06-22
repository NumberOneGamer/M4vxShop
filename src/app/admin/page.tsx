import type { Metadata } from "next"
import AdminDashboardClient from "./admin-dashboard-client"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your store, products, orders, and customers.",
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <AdminDashboardClient />
}
