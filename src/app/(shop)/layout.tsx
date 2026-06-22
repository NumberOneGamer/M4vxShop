import type { ReactNode } from "react"
import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BottomNav } from "@/components/layout/bottom-nav"

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="flex-1 pb-14 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
    </>
  )
}
