import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Find the right fit with the M4vx size guide.",
  alternates: { canonical: "/size-guide" },
}

export default function SizeGuidePage() {
  return (
    <div className="bg-background py-24 md:py-32">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Size Guide</h1>
        <p className="text-muted-foreground mb-8">Measurements are provided in the product description for each item. If you need additional sizing information, contact our support team.</p>
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="text-left p-3 font-medium">Size</th>
                <th className="text-left p-3 font-medium">Chest (in)</th>
                <th className="text-left p-3 font-medium">Waist (in)</th>
                <th className="text-left p-3 font-medium">Length (in)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { size: "S", chest: "36-38", waist: "30-32", length: "28" },
                { size: "M", chest: "39-41", waist: "33-35", length: "29" },
                { size: "L", chest: "42-44", waist: "36-38", length: "30" },
                { size: "XL", chest: "45-47", waist: "39-41", length: "31" },
              ].map((row) => (
                <tr key={row.size} className="border-b border-border">
                  <td className="p-3 font-medium">{row.size}</td>
                  <td className="p-3 text-muted-foreground">{row.chest}</td>
                  <td className="p-3 text-muted-foreground">{row.waist}</td>
                  <td className="p-3 text-muted-foreground">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
