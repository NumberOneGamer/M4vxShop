"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Search, User, Heart, ShoppingBag, Menu, ChevronDown } from "lucide-react"
import { useScrollDirection } from "@/hooks/use-scroll-direction"
import { cn } from "@/lib/utils"
import { Container } from "./container"
import { MobileNav } from "./mobile-nav"
import { CartDrawer } from "./cart-drawer"
import { CartCountBadge } from "@/components/cart/cart-count-badge"
import { SearchCommand } from "./search-command"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  {
    label: "Categories",
    href: "#",
    children: [
      { label: "Tech", href: "/shop/category/tech" },
      { label: "Accessories", href: "/shop/category/accessories" },
      { label: "Home", href: "/shop/category/home" },
      { label: "Lifestyle", href: "/shop/category/lifestyle" },
      { label: "Fitness", href: "/shop/category/fitness" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const direction = useScrollDirection()

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isHidden = direction === "down" && scrolled

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-transform duration-300 transform-gpu",
          isHidden ? "-translate-y-full" : "translate-y-0",
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-border shadow-xs"
            : "bg-transparent"
        )}
      >
        <Container>
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 -ml-2"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className={cn(
                "font-heading text-xl font-bold tracking-tight transition-colors",
                scrolled ? "text-foreground" : "text-white"
              )}
            >
              M4VX
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setCategoryOpen(true)}
                    onMouseLeave={() => setCategoryOpen(false)}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-1 text-sm font-medium transition-colors",
                        scrolled
                          ? "text-foreground/70 hover:text-foreground"
                          : "text-white/70 hover:text-white"
                      )}
                    >
                      {link.label}
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    <AnimatePresence>
                      {categoryOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-sm border shadow-lg py-2"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      scrolled
                        ? "text-foreground/70 hover:text-foreground"
                        : "text-white/70 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className={cn(
                  "p-2 transition-colors",
                  scrolled
                    ? "text-foreground/70 hover:text-foreground"
                    : "text-white/70 hover:text-white"
                )}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/account"
                className={cn(
                  "p-2 transition-colors hidden sm:block",
                  scrolled
                    ? "text-foreground/70 hover:text-foreground"
                    : "text-white/70 hover:text-white"
                )}
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>
              <Link
                href="/account/wishlist"
                className={cn(
                  "p-2 transition-colors hidden sm:block",
                  scrolled
                    ? "text-foreground/70 hover:text-foreground"
                    : "text-white/70 hover:text-white"
                )}
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className={cn(
                  "p-2 transition-colors relative",
                  scrolled
                    ? "text-foreground/70 hover:text-foreground"
                    : "text-white/70 hover:text-white"
                )}
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                <CartCountBadge />
              </button>
            </div>
          </div>
        </Container>
      </header>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} links={NAV_LINKS} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchCommand open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
