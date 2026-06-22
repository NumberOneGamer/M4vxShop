import { createAuthClient } from "better-auth/client";

function normalizeUrl(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`
  }
  return url
}

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL
    ? normalizeUrl(process.env.BETTER_AUTH_URL)
    : process.env.NEXT_PUBLIC_VERCEL_URL
      ? normalizeUrl(process.env.NEXT_PUBLIC_VERCEL_URL)
      : "http://localhost:3000",
});
