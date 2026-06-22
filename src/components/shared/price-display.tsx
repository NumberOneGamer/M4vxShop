import { cn } from "@/lib/utils"

interface PriceDisplayProps {
  price: number
  comparePrice?: number | null
  size?: "sm" | "md" | "lg"
  className?: string
}

const priceSizes = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
}

const compareSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
}

export function PriceDisplay({ price, comparePrice, size = "md", className }: PriceDisplayProps) {
  const hasDiscount = comparePrice && comparePrice > price

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-semibold tracking-tight", priceSizes[size])}>
        ${price.toFixed(2)}
      </span>
      {hasDiscount && (
        <span
          className={cn(
            "text-muted-foreground line-through",
            compareSizes[size]
          )}
        >
          ${comparePrice.toFixed(2)}
        </span>
      )}
    </div>
  )
}
