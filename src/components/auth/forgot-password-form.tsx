"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email"),
})

type ForgotValues = z.infer<typeof forgotSchema>

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

export function ForgotPasswordForm() {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(data: ForgotValues) {
    setIsPending(true)
    setError(null)
    try {
      const res = await (authClient as unknown as {
        requestPasswordReset: (params: { email: string; redirectTo?: string }) => Promise<{ error?: { message: string } }>
      }).requestPasswordReset({ email: data.email, redirectTo: "/reset-password" })
      if (res.error) {
        setError(res.error.message)
        setIsPending(false)
        return
      }
      setSent(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsPending(false)
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm mx-auto text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="rounded-full border-2 border-foreground p-3">
            <CheckCircle2 className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-2xl font-heading font-bold mb-2">Check your email</h1>
        <p className="text-sm text-muted-foreground mb-6">
          We&apos;ve sent a password reset link to <strong className="text-foreground">{form.getValues("email")}</strong>
        </p>
        <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
          Send again
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Back to sign in
          </Link>
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-sm mx-auto"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h1 className="text-2xl font-heading font-bold">Forgot password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </motion.div>

      <motion.form
        variants={itemVariants}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {error && (
          <div className="rounded-sm border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="hello@m4vx.com"
            autoComplete="email"
            disabled={isPending}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send reset link
        </Button>
      </motion.form>

      <motion.p variants={itemVariants} className="mt-6 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  )
}
