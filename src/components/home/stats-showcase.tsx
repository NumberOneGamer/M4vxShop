import { StatItem } from "./stat-item"

const stats = [
  { value: 50000, suffix: "+", label: "Happy Customers" },
  { value: 10000, suffix: "+", label: "Products Available" },
  { value: 150, suffix: "+", label: "Countries Shipped" },
]

export function StatsShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-16 md:py-20 border-y border-border">
      {stats.map((stat) => (
        <StatItem
          key={stat.label}
          value={stat.value}
          suffix={stat.suffix}
          label={stat.label}
        />
      ))}
    </div>
  )
}
