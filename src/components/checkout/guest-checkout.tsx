"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const guestSchema = z.object({
  email: z.string().email("Valid email required"),
})

interface GuestCheckoutProps {
  onContinue: (email: string) => void
}

export function GuestCheckout({ onContinue }: GuestCheckoutProps) {
  const [mode, setMode] = useState<"choice" | "guest">("choice")
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof guestSchema>>({
    resolver: zodResolver(guestSchema),
  })

  if (mode === "choice") {
    return (
      <div className="space-y-6">
        <div className="border border-border p-6 text-center space-y-3">
          <h2 className="text-lg font-semibold">Sign In</h2>
          <p className="text-sm text-muted-foreground">
            Sign in to your account for faster checkout.
          </p>
          <Button asChild className="w-full rounded-none">
            <Link href="/login?redirect=/checkout">Sign In</Link>
          </Button>
        </div>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
            OR
          </span>
        </div>

        <div className="border border-border p-6 text-center space-y-3">
          <h2 className="text-lg font-semibold">Guest Checkout</h2>
          <p className="text-sm text-muted-foreground">
            Continue without an account. You can create one after purchase.
          </p>
          <Button
            variant="outline"
            className="w-full rounded-none"
            onClick={() => setMode("guest")}
          >
            Continue as Guest
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit((d) => onContinue(d.email))} className="space-y-4">
      <h2 className="text-lg font-semibold">Guest Checkout</h2>
      <p className="text-sm text-muted-foreground">
        Enter your email to continue.
      </p>
      <div className="space-y-1">
        <Label htmlFor="guest-email">Email</Label>
        <Input id="guest-email" type="email" {...register("email")} placeholder="your@email.com" />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <Button type="submit" className="w-full rounded-none">
        Continue
      </Button>
      <button
        type="button"
        onClick={() => setMode("choice")}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Back to sign in
      </button>
    </form>
  )
}
