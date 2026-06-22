import Link from "next/link"
import { Container } from "./container"

const FOOTER_LINKS = {
  Shop: [
    { label: "All Products", href: "/shop" },
    { label: "Tech", href: "/shop/category/tech" },
    { label: "Accessories", href: "/shop/category/accessories" },
    { label: "Home", href: "/shop/category/home" },
    { label: "Lifestyle", href: "/shop/category/lifestyle" },
    { label: "Fitness", href: "/shop/category/fitness" },
  ],
  Support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faqs" },
    { label: "Shipping & Returns", href: "/shipping" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Track Order", href: "/account/orders" },
  ],
  Connect: [
    { label: "Instagram", href: "#" },
    { label: "Twitter/X", href: "#" },
    { label: "TikTok", href: "#" },
    { label: "YouTube", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-black text-white">
      <Container className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-heading text-xl font-bold tracking-tight">
              M4VX
            </Link>
            <p className="mt-3 text-sm text-white/60 max-w-xs">
              Premium products curated for modern lifestyles. Quality-driven, design-focused.
            </p>
            <div className="mt-4 flex gap-3">
              {["IG", "X", "TT", "YT"].map((s) => (
                <Link
                  key={s}
                  href="#"
                  className="h-8 w-8 border border-white/20 flex items-center justify-center text-[10px] font-medium text-white/60 hover:text-white hover:border-white/40 transition-colors"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} M4vx. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Visa</span>
            <span>MC</span>
            <span>Amex</span>
            <span>PayPal</span>
            <span>Apple Pay</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
