"use client"

import { Toaster as Sonner } from "sonner"

type ToastProps = React.ComponentProps<typeof Sonner>

export function ToastProvider({ ...props }: ToastProps) {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        duration: 3000,
        className: "border border-border bg-background text-foreground shadow-lg",
        descriptionClassName: "text-sm text-muted-foreground",
      }}
      {...props}
    />
  )
}
