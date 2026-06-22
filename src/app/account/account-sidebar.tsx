"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
} from "lucide-react"

interface AccountSidebarProps {
  user: { id: string; email: string; name?: string | null }
}

const links = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/payments", label: "Payments", icon: CreditCard },
  { href: "/account/settings", label: "Settings", icon: Settings },
]

export function AccountSidebar({ user }: AccountSidebarProps) {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      <div className="mb-4 pb-4 border-b border-border">
        <p className="text-sm font-medium truncate">{user.name ?? "Account"}</p>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-foreground text-background font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={1.5} />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
