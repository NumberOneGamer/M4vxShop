"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getShippingRates } from "@/server/services/shipping-service"

const shippingSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phone: z.string().optional(),
  shippingMethod: z.string().min(1, "Please select a shipping method"),
})

export type ShippingFormData = z.infer<typeof shippingSchema>

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void
  defaultValues?: Partial<ShippingFormData>
}

export function ShippingForm({ onSubmit, defaultValues }: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      phone: "",
      shippingMethod: "standard",
      ...defaultValues,
    },
  })

  const rates = getShippingRates()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Contact</h2>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} placeholder="your@email.com" />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" {...register("firstName")} placeholder="John" />
            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" {...register("lastName")} placeholder="Doe" />
            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
          </div>
          <div className="sm:col-span-2 space-y-1">
            <Label htmlFor="address1">Address</Label>
            <Input id="address1" {...register("address1")} placeholder="123 Main St" />
            {errors.address1 && <p className="text-xs text-destructive">{errors.address1.message}</p>}
          </div>
          <div className="sm:col-span-2 space-y-1">
            <Label htmlFor="address2">Apartment, suite, etc. (optional)</Label>
            <Input id="address2" {...register("address2")} placeholder="Apt 4B" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register("city")} placeholder="New York" />
            {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="state">State</Label>
            <Input id="state" {...register("state")} placeholder="NY" />
            {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input id="postalCode" {...register("postalCode")} placeholder="10001" />
            {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" type="tel" {...register("phone")} placeholder="+1 (555) 000-0000" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Shipping Method</h2>
        <RadioGroup defaultValue="standard" className="space-y-2">
          {rates.map((rate) => (
            <label
              key={rate.id}
              className="flex items-center justify-between rounded-lg border border-border p-3 cursor-pointer hover:bg-secondary/50 transition-colors has-[[data-state=checked]]:border-foreground"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={rate.id} {...register("shippingMethod")} />
                <div>
                  <p className="text-sm font-medium">{rate.label}</p>
                  <p className="text-xs text-muted-foreground">{rate.estimatedDays}</p>
                </div>
              </div>
              <span className="text-sm font-medium">${rate.cost.toFixed(2)}</span>
            </label>
          ))}
        </RadioGroup>
        {errors.shippingMethod && <p className="text-xs text-destructive mt-1">{errors.shippingMethod.message}</p>}
      </div>
    </form>
  )
}
