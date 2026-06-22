"use client"

import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderTimelineProps {
  steps: {
    name: string
    timestamp: string
    isCompleted: boolean
  }[]
}

export function OrderTimeline({ steps }: OrderTimelineProps) {
  return (
    <div className="w-full max-w-md">
      {steps.map((step, index) => (
        <div key={index} className="flex">
          <div className="flex flex-col items-center">
            {step.isCompleted ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-foreground" strokeWidth={1.5} />
            ) : (
              <Circle className="h-5 w-5 shrink-0 text-muted-foreground/40" strokeWidth={1.5} />
            )}
            {index < steps.length - 1 && (
              <div
                className={cn("w-px grow", {
                  "bg-foreground": steps[index + 1].isCompleted,
                  "bg-border": !steps[index + 1].isCompleted,
                })}
              />
            )}
          </div>
          <div className="ml-3 pb-6">
            <p className={cn("text-sm font-medium", !step.isCompleted && "text-muted-foreground/50")}>
              {step.name}
            </p>
            {step.timestamp && (
              <p className="text-xs text-muted-foreground">{step.timestamp}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
