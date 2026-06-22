import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";

const baseUrl = process.env.BETTER_AUTH_URL
  ?? (process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000")

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET ?? (
    process.env.NODE_ENV === "production"
      ? undefined
      : "dev-secret-do-not-use-in-production-1234567890"
  ),
  baseURL: baseUrl,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      enabled: false,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      enabled: false,
    },
  },
  plugins: [nextCookies()],
});
