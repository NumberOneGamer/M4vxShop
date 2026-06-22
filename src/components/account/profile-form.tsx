"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

interface ProfileFormProps {
  defaultValues: { name: string; email: string; phone?: string }
  onSave: (data: { name: string; email: string; phone?: string }) => Promise<void>
  onChangePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>
}

export function ProfileForm({ defaultValues, onSave, onChangePassword }: ProfileFormProps) {
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  })

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  })

  const handleProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
    await onSave(data)
  }

  const handlePasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    await onChangePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword })
    passwordForm.reset()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and security settings.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Profile</h2>
        <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4 max-w-md">
          <div className="space-y-1">
            <Label htmlFor="profile-name">Name</Label>
            <Input id="profile-name" {...profileForm.register("name")} />
            {profileForm.formState.errors.name && (
              <p className="text-xs text-destructive">{profileForm.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="profile-email">Email</Label>
            <Input id="profile-email" type="email" {...profileForm.register("email")} />
            {profileForm.formState.errors.email && (
              <p className="text-xs text-destructive">{profileForm.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="profile-phone">Phone (optional)</Label>
            <Input id="profile-phone" type="tel" {...profileForm.register("phone")} />
          </div>
          <Button type="submit" disabled={profileForm.formState.isSubmitting} className="rounded-none">
            {profileForm.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </form>
      </div>

      <Separator />

      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4 max-w-md">
          <div className="space-y-1">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" {...passwordForm.register("currentPassword")} />
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-xs text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" {...passwordForm.register("newPassword")} />
            {passwordForm.formState.errors.newPassword && (
              <p className="text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" {...passwordForm.register("confirmPassword")} />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-xs text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit" disabled={passwordForm.formState.isSubmitting} className="rounded-none">
            {passwordForm.formState.isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  )
}
