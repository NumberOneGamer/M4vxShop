"use client"

import * as Slider from "@radix-ui/react-slider"
import { useState } from "react"

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: PriceRangeSliderProps) {
  const [local, setLocal] = useState(value)

  return (
    <div className="space-y-3">
      <Slider.Root
        min={min}
        max={max}
        step={1}
        value={local}
        onValueChange={(v) => {
          setLocal(v as [number, number])
          onChange(v as [number, number])
        }}
        className="relative flex items-center w-full h-5 touch-none select-none"
      >
        <Slider.Track className="relative h-px bg-border w-full">
          <Slider.Range className="absolute h-full bg-foreground" />
        </Slider.Track>
        <Slider.Thumb className="block w-3.5 h-3.5 border border-foreground bg-background shadow-sm focus:outline-none focus:ring-1 focus:ring-foreground/30" />
        <Slider.Thumb className="block w-3.5 h-3.5 border border-foreground bg-background shadow-sm focus:outline-none focus:ring-1 focus:ring-foreground/30" />
      </Slider.Root>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>${local[0]}</span>
        <span>${local[1]}</span>
      </div>
    </div>
  )
}
