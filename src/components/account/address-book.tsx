"use client"

import { useState } from "react"
import { Plus, MapPin, Pencil, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddressFormDialog } from "./address-form"

interface Address {
  id: string
  label: string | null
  line1: string
  line2: string | null
  city: string
  state: string | null
  postalCode: string
  country: string
  phone: string | null
  isDefault: boolean
}

interface AddressBookProps {
  addresses: Address[]
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
  onSave: (data: { id?: string; label?: string; line1: string; line2?: string; city: string; state?: string; postalCode: string; phone?: string; isDefault?: boolean }) => Promise<void>
}

export function AddressBook({ addresses, onDelete, onSetDefault, onSave }: AddressBookProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Addresses</h1>
          <p className="text-muted-foreground mt-1">Manage your shipping addresses.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowAdd(true)} className="rounded-none gap-1.5">
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
          Add Address
        </Button>
      </div>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="border border-border p-4 relative space-y-2">
              {addr.isDefault && (
                <span className="absolute top-3 right-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Default
                </span>
              )}
              {addr.label && <p className="text-sm font-medium">{addr.label}</p>}
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p>{addr.line1}</p>
                {addr.line2 && <p>{addr.line2}</p>}
                <p>
                  {addr.city}{addr.state ? `, ${addr.state}` : ""} {addr.postalCode}
                </p>
                {addr.phone && <p>{addr.phone}</p>}
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setEditingId(addr.id)}
                  className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Pencil className="h-3 w-3" strokeWidth={1.5} />
                  Edit
                </button>
                {!addr.isDefault && (
                  <>
                    <button
                      onClick={() => onSetDefault(addr.id)}
                      className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Check className="h-3 w-3" strokeWidth={1.5} />
                      Set Default
                    </button>
                    <button
                      onClick={() => onDelete(addr.id)}
                      className="text-xs flex items-center gap-1 text-destructive hover:text-destructive/80 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" strokeWidth={1.5} />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-border">
          <MapPin className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" strokeWidth={1.5} />
          <p className="text-muted-foreground">No addresses saved yet.</p>
        </div>
      )}

      {(showAdd || editingId) && (
        <AddressFormDialog
          address={editingId ? addresses.find((a) => a.id === editingId) ?? null : null}
          onSave={async (data) => {
            await onSave({ ...data, id: editingId ?? undefined })
            setShowAdd(false)
            setEditingId(null)
          }}
          onClose={() => {
            setShowAdd(false)
            setEditingId(null)
          }}
        />
      )}
    </div>
  )
}
