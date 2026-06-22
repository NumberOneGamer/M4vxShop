"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const addressSchema = z.object({
  label: z.string().optional(),
  line1: z.string().min(1, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required"),
  phone: z.string().optional(),
  isDefault: z.boolean().optional(),
})

type AddressFormData = z.infer<typeof addressSchema>

interface AddressFormDialogProps {
  address: {
    id: string
    label: string | null
    line1: string
    line2: string | null
    city: string
    state: string | null
    postalCode: string
    phone: string | null
    isDefault: boolean
  } | null
  onSave: (data: AddressFormData) => Promise<void>
  onClose: () => void
}

export function AddressFormDialog({ address, onSave, onClose }: AddressFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: address?.label ?? "",
      line1: address?.line1 ?? "",
      line2: address?.line2 ?? "",
      city: address?.city ?? "",
      state: address?.state ?? "",
      postalCode: address?.postalCode ?? "",
      phone: address?.phone ?? "",
      isDefault: address?.isDefault ?? false,
    },
  })

  const onSubmit = async (data: AddressFormData) => {
    setLoading(true)
    await onSave(data)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background w-full max-w-md mx-4 p-6 border border-border">
        <h2 className="text-lg font-semibold mb-4">
          {address ? "Edit Address" : "Add Address"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="label">Label (optional)</Label>
            <Input id="label" {...register("label")} placeholder="Home, Work, etc." />
          </div>
          <div className="space-y-1">
            <Label htmlFor="addr-line1">Address</Label>
            <Input id="addr-line1" {...register("line1")} placeholder="123 Main St" />
            {errors.line1 && <p className="text-xs text-destructive">{errors.line1.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="addr-line2">Apt, Suite (optional)</Label>
            <Input id="addr-line2" {...register("line2")} placeholder="Apt 4B" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="addr-city">City</Label>
              <Input id="addr-city" {...register("city")} placeholder="New York" />
              {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="addr-state">State</Label>
              <Input id="addr-state" {...register("state")} placeholder="NY" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="addr-postal">Postal Code</Label>
              <Input id="addr-postal" {...register("postalCode")} placeholder="10001" />
              {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="addr-phone">Phone</Label>
              <Input id="addr-phone" type="tel" {...register("phone")} placeholder="+1 (555) 000-0000" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="addr-default" {...register("isDefault")} />
            <Label htmlFor="addr-default" className="text-sm font-normal">Set as default address</Label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-none">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 rounded-none">
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
