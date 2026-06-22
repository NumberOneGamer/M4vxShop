"use client"

import { useState } from "react"
import { Bell } from "lucide-react"

interface NotificationSettingsProps {
  preferences: {
    orderUpdates: boolean
    promotions: boolean
    newsletter: boolean
  }
  onSave: (prefs: { orderUpdates: boolean; promotions: boolean; newsletter: boolean }) => Promise<void>
}

export function NotificationSettings({ preferences, onSave }: NotificationSettingsProps) {
  const [prefs, setPrefs] = useState(preferences)
  const [loading, setLoading] = useState(false)

  const toggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setLoading(true)
    await onSave(prefs)
    setLoading(false)
  }

  const items = [
    { key: "orderUpdates" as const, label: "Order Updates", desc: "Receive updates about your orders" },
    { key: "promotions" as const, label: "Promotions", desc: "Get notified about sales and deals" },
    { key: "newsletter" as const, label: "Newsletter", desc: "Receive our monthly newsletter" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-muted-foreground mt-1">Manage your email preferences.</p>
      </div>

      <div className="border border-border divide-y divide-border">
        {items.map((item) => (
          <label
            key={item.key}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={prefs[item.key]}
              onClick={() => toggle(item.key)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                prefs[item.key] ? "bg-foreground" : "bg-border"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-background transition-transform ${
                  prefs[item.key] ? "translate-x-[18px]" : "translate-x-[3px]"
                }`}
              />
            </button>
          </label>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="px-6 py-2 bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Preferences"}
      </button>
    </div>
  )
}
