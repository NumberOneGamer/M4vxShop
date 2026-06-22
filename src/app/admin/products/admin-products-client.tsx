"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { Pencil, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { deleteProduct } from "@/server/actions/admin-actions"

interface AdminProductsClientProps {
  products: {
    id: string
    name: string
    slug: string
    sku: string
    price: number
    stock: number
    isActive: boolean
    image: string | null
    categories: string[]
    totalSold: number
  }[]
}

export function AdminProductsClient({ products }: AdminProductsClientProps) {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const columns: Column<(typeof products)[0]>[] = [
    {
      key: "name",
      header: "Product",
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-muted flex items-center justify-center text-xs text-muted-foreground overflow-hidden shrink-0 relative">
            {row.image ? (
              <Image src={row.image} alt={row.name} fill className="object-cover" sizes="40px" />
            ) : (
              "—"
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate max-w-[250px]">{row.name}</p>
            <p className="text-xs text-muted-foreground">SKU: {row.sku || "—"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (value) => <span className="font-medium">{formatPrice(value as number)}</span>,
    },
    {
      key: "stock",
      header: "Stock",
      sortable: true,
      render: (value) => (
        <span className={typeof value === "number" && value <= 5 ? "text-destructive" : ""}>
          {String(value)}
        </span>
      ),
    },
    {
      key: "categories",
      header: "Categories",
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {(value as string[]).map((cat) => (
            <Badge key={cat} variant="outline" className="text-[10px] px-1.5 py-0 h-auto">
              {cat}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (value) => (
        <Badge variant={value ? "default" : "outline"} className="text-[10px] px-1.5 py-0 h-auto">
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "id",
      header: "Actions",
      width: "120px",
      render: (value) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Link href={`/admin/products/${value}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href={`/shop/${products.find((p) => p.id === value)?.slug}`} target="_blank">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={async () => {
              if (confirm("Delete this product?")) {
                await deleteProduct(value as string)
                router.refresh()
              }
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      data={products}
      columns={columns}
      searchPlaceholder="Search products..."
      itemsPerPage={20}
      selection={{
        selected,
        onSelectionChange: setSelected,
        getId: (row) => row.id,
      }}
    />
  )
}
