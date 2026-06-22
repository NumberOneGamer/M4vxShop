"use client"

import { motion } from "framer-motion"
import { Shield, Truck, RefreshCw } from "lucide-react"

const badges = [
  { icon: Shield, label: "Secure Checkout", desc: "SSL Encrypted" },
  {
    icon: Truck,
    label: "Free Shipping",
    desc: "On orders over $100",
  },
  {
    icon: RefreshCw,
    label: "30-Day Returns",
    desc: "No questions asked",
  },
]

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 py-10">
      {badges.map((badge, i) => (
        <motion.div
          key={badge.label}
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <badge.icon className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{badge.label}</p>
            <p className="text-xs text-muted-foreground">{badge.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
