"use client"

import { useRef, useState } from "react"
import { Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductVideoProps {
  src: string
  poster?: string | null
  className?: string
}

export function ProductVideo({ src, poster, className }: ProductVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const toggle = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className={cn("relative group overflow-hidden bg-secondary", className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster ?? undefined}
        className="w-full h-full object-cover"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        playsInline
        preload="metadata"
      />
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          "bg-black/20 transition-opacity",
          isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
        )}
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        <div className="w-14 h-14 flex items-center justify-center bg-background/90 border border-border">
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </div>
      </button>
    </div>
  )
}
