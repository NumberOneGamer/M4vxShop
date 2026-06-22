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

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type RegisterValues = z.infer<typeof registerSchema>

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

export function RegisterForm() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  async function onSubmit(data: RegisterValues) {
    setIsPending(true)
    setError(null)
    const result = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    })
    if (result.error) {
      setError(result.error.message || "Registration failed")
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
        <h1 className="text-2xl font-heading font-bold">Create an account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Join the M4vx experience</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <OAuthButtons />
      </motion.div>

      <motion.div variants={itemVariants} className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or sign up with email</span>
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
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            autoComplete="name"
            disabled={isPending}
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending}
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
            disabled={isPending}
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create account
        </Button>
      </motion.form>

      <motion.p variants={itemVariants} className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  )
}
