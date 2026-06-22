import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  options?: {
    currency?: "USD" | "EUR" | "GBP";
    notation?: Intl.NumberFormatOptions["notation"];
  },
) {
  const { currency = "USD", notation = "standard" } = options ?? {};
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(Number(price));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat("en-US").format(num);
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "...";
}

export function generateOrderNumber() {
  const prefix = "M4VX";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_VERCEL_URL ?? "http://localhost:3000"}${path}`;
}
