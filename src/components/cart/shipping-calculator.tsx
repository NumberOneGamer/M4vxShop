"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Truck, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { CartShippingOption } from "@/types/cart"

const SHIPPING_OPTIONS: CartShippingOption[] = [
  { id: "standard", label: "Standard Shipping", cost: 5.99, estimatedDays: "5-7 business days" },
  { id: "express", label: "Express Shipping", cost: 14.99, estimatedDays: "2-3 business days" },
  { id: "priority", label: "Priority Shipping", cost: 24.99, estimatedDays: "1-2 business days" },
  { id: "free", label: "Free Shipping", cost: 0, estimatedDays: "7-12 business days" },
]

interface ShippingCalculatorProps {
  subtotal: number
  selected: CartShippingOption | null
  onSelect: (option: CartShippingOption) => void
}

export function ShippingCalculator({ subtotal, selected, onSelect }: ShippingCalculatorProps) {
  const [zipCode, setZipCode] = useState("")
  const [calculating, setCalculating] = useState(false)

  const freeThreshold = 100
  const freeShippingAvailable = subtotal >= freeThreshold

  const options = SHIPPING_OPTIONS.map((opt) =>
    opt.id === "free" && !freeShippingAvailable
      ? { ...opt, label: `${opt.label} (orders over $${freeThreshold})` }
      : opt
  )

  const handleCalculate = async () => {
    if (!zipCode.trim()) return
    setCalculating(true)
    await new Promise((r) => setTimeout(r, 800))
    setCalculating(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Truck className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Shipping</span>
      </div>

      <div className="flex gap-2">
        <Input
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="ZIP / Postal code"
          className="rounded-none text-sm h-10 flex-1"
          maxLength={10}
        />
        <Button
          onClick={handleCalculate}
          disabled={!zipCode.trim() || calculating}
          variant="outline"
          className="rounded-none text-sm h-10"
        >
          {calculating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Calculate"}
        </Button>
      </div>

      <AnimatePresence>
        {zipCode && !calculating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <RadioGroup
              value={selected?.id ?? ""}
              onValueChange={(value) => {
                const option = SHIPPING_OPTIONS.find((o) => o.id === value)
                if (option) onSelect(option)
              }}
              className="space-y-2"
            >
              {options.map((option) => {
                const isFree = option.cost === 0
                const disabled = option.id === "free" && !freeShippingAvailable
                return (
                  <div key={option.id} className="flex items-start gap-3">
                    <RadioGroupItem
                      value={option.id}
                      id={`shipping-${option.id}`}
                      disabled={disabled}
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor={`shipping-${option.id}`}
                      className={cn(
                        "flex-1 text-sm cursor-pointer",
                        disabled && "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option.label}</span>
                        <span className={cn(isFree && "text-foreground font-medium")}>
                          {isFree ? "FREE" : `$${option.cost.toFixed(2)}`}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {option.estimatedDays}
                      </p>
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


