"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { BestSellerSlide } from "./best-seller-slide"
import type { BestSellerProduct } from "@/types/product"

interface BestSellersCarouselClientProps {
  products: BestSellerProduct[]
}

export function BestSellersCarouselClient({
  products,
}: BestSellersCarouselClientProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  const plugin = React.useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  )

  React.useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  if (products.length === 0) return null

  return (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            Best Sellers
          </span>
          <h2 className="mt-3 font-heading font-bold text-3xl md:text-5xl tracking-tight">
            Most Wanted
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md">
            The products everyone is talking about — ranked by popularity.
          </p>
        </motion.div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
        >
          <CarouselContent>
            {products.map((product, i) => (
              <CarouselItem
                key={product.id}
                className="basis-full sm:basis-1/2 lg:basis-1/4 pl-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  <BestSellerSlide product={product} rank={i + 1} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex items-center justify-center gap-2 mt-8">
          {products.map((_, i) => (
            <button
              key={i}
              type="button"
              className="h-2 rounded-full transition-all duration-300 data-[active=true]:w-8 data-[active=true]:bg-foreground bg-muted-foreground/30"
              data-active={i === current}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
