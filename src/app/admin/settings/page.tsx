"use client"

import { AdminMobileNav } from "@/components/admin/admin-mobile-nav"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Store settings and configuration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-sm">Store Information</h3>
          </div>
          <div className="p-4 space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Store Name</span>
              <span className="font-medium">M4vx</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Currency</span>
              <span className="font-medium">USD ($)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timezone</span>
              <span className="font-medium">UTC</span>
            </div>
          </div>
        </div>

        <div className="border border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-sm">Integrations</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Stripe</p>
                <p className="text-xs text-muted-foreground">Payment processing</p>
              </div>
              <Badge variant="outline" className="text-[10px]">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Resend</p>
                <p className="text-xs text-muted-foreground">Email delivery</p>
              </div>
              <Badge variant="outline" className="text-[10px]">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Cloudflare R2</p>
                <p className="text-xs text-muted-foreground">File storage</p>
              </div>
              <Badge variant="outline" className="text-[10px]">Connected</Badge>
            </div>
          </div>
        </div>
      </div>

      <AdminMobileNav />
    </div>
  )
}

function Badge({ variant, className, children }: { variant?: "default" | "outline"; className?: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border ${variant === "outline" ? "border-border text-muted-foreground" : "bg-foreground text-background"} ${className ?? ""}`}>
      {children}
    </span>
  )
}
