"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { OAuthButtons } from "./oauth-buttons"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

type LoginValues = z.infer<typeof loginSchema>

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

export function LoginForm() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: LoginValues) {
    setIsPending(true)
    setError(null)
    const result = await authClient.signIn.email({ email: data.email, password: data.password })
    if (result.error) {
      setError(result.error.message || "Invalid credentials")
      setIsPending(false)
      return
    }
    router.push("/")
    router.refresh()
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-sm mx-auto"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <Link href="/" className="inline-block font-heading text-2xl font-bold uppercase tracking-tight mb-6">
          M4vx
        </Link>
        <h1 className="text-2xl font-heading font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <OAuthButtons />
      </motion.div>

      <motion.div variants={itemVariants} className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or continue with email</span>
        </div>
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isPending}
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign in
        </Button>
      </motion.form>

      <motion.p variants={itemVariants} className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-foreground hover:underline">
          Create one
        </Link>
      </motion.p>
    </motion.div>
  )
}
