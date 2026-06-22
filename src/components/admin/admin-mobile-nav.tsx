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
} from "lucide-react"

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

export function AdminMobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden">
      <div className="flex items-center justify-around h-14">
        {links.slice(0, 5).map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
