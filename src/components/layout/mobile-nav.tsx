"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight } from "lucide-react"
import { useFocusTrap } from "@/hooks/use-focus-trap"
interface NavLink {
  label: string
  href: string
  children?: NavLink[]
}

interface MobileNavProps {
  open: boolean
  onClose: () => void
  links: NavLink[]
}

export function MobileNav({ open, onClose, links }: MobileNavProps) {
  const dialogRef = useFocusTrap(open)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.nav
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-heading text-lg font-bold">M4VX</span>
              <button ref={closeRef} onClick={onClose} className="p-2 -mr-2" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              {links.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  {link.children ? (
                    <div className="px-4 py-2">
                      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {link.label}
                      </span>
                      <div className="mt-2 space-y-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={onClose}
                            className="flex items-center justify-between py-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
                          >
                            {child.label}
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block px-6 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="border-t p-4">
              <Link
                href="/login"
                onClick={onClose}
                className="block w-full text-center py-2.5 text-sm font-medium bg-black text-white hover:bg-black/90 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}
