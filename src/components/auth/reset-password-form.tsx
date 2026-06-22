"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type ResetValues = z.infer<typeof resetSchema>

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  async function onSubmit(data: ResetValues) {
    if (!token) {
      setError("Invalid or missing reset token")
      return
    }
    setIsPending(true)
    setError(null)
    const result = await authClient.resetPassword({ newPassword: data.password, token })
    if (result.error) {
      setError(result.error.message || "Password reset failed")
      setIsPending(false)
      return
    }
    setSuccess(true)
    setTimeout(() => router.push("/login"), 2000)
  }

  if (success) {
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
        <h1 className="text-2xl font-heading font-bold mb-2">Password updated</h1>
        <p className="text-sm text-muted-foreground">Redirecting to sign in...</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-heading font-bold">Set new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your new password below</p>
      </div>

      {!token && (
        <div className="rounded-sm border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-4">
          Invalid reset link. Please request a new one.
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-sm border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending || !token}
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending || !token}
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isPending || !token}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Reset password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Back to sign in
        </Link>
      </p>
    </motion.div>
  )
}
