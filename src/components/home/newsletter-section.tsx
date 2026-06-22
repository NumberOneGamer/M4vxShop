"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { subscribeToNewsletter } from "@/server/actions/newsletter-actions"
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Status = "idle" | "loading" | "success" | "error"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus("loading")
    const result = await subscribeToNewsletter(email.trim())
    setStatus(result.success ? "success" : "error")
    setMessage(result.message)

    if (result.success) {
      setEmail("")
    }

    setTimeout(() => {
      setStatus("idle")
      setMessage("")
    }, 4000)
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
      <div className="relative overflow-hidden border border-border bg-gradient-to-br from-background via-background to-secondary/30 px-6 py-16 md:py-20 md:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Stay in the loop
          </h2>
          <p className="text-muted-foreground mt-2 text-sm mb-8">
            Get early access to new drops, restocks, and exclusive offers
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={status === "loading"}
                className={cn(
                  "w-full h-11 px-4 text-sm bg-background border border-border",
                  "placeholder:text-muted-foreground/50",
                  "focus:outline-none focus:ring-1 focus:ring-foreground/20",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  status === "success" && "border-green-500/50",
                  status === "error" && "border-red-500/50"
                )}
              />
              <AnimatePresence>
                {status !== "idle" && (
                  <motion.div
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    {status === "loading" && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                    {status === "success" && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {status === "error" && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              disabled={status === "loading" || !email.trim()}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 text-sm font-medium bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.98 }}
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          </form>

          <AnimatePresence>
            {message && (
              <motion.p
                className={cn(
                  "mt-4 text-xs",
                  status === "success" && "text-green-500",
                  status === "error" && "text-red-500"
                )}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
