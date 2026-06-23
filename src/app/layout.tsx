import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { SkipLink } from "@/components/layout/skip-link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

function normalizeUrl(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`
  }
  return url
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_VERCEL_URL
      ? normalizeUrl(process.env.NEXT_PUBLIC_VERCEL_URL)
      : "http://localhost:3000"
  ),
  title: {
    default: "M4vx | Premium Dropshipping",
    template: "%s | M4vx",
  },
  description: "Premium products curated for modern lifestyles.",
  openGraph: {
    title: "M4vx | Premium Dropshipping",
    description: "Premium products curated for modern lifestyles.",
    url: "/",
    siteName: "M4vx",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SkipLink />
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
