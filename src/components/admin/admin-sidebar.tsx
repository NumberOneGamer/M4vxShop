"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Percent,
  Star,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Percent },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] border-r border-border bg-background transition-all duration-300 hidden md:flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Admin navigation">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-sm",
                collapsed && "justify-center",
                isActive
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          )
        })}
      </nav>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  )
}
