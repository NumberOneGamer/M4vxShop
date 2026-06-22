"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, ShoppingCart, Heart, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { CartCountBadge } from "@/components/cart/cart-count-badge"

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "Cart", href: "/cart", icon: ShoppingCart, badge: true },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Account", href: "/account", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    if (href === "/account/wishlist") return pathname.startsWith("/account/wishlist")
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden">
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 flex-1 h-full",
              "transition-colors relative",
              isActive(item.href)
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="relative">
              <item.icon className="w-5 h-5" strokeWidth={1.5} />
              {item.badge && <CartCountBadge />}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
