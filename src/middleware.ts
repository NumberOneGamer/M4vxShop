import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const authPages = ["/login", "/register", "/forgot-password", "/reset-password"];
const protectedPages = ["/account", "/account/orders", "/account/wishlist", "/account/addresses", "/account/payments", "/account/settings"];
const adminPages = ["/admin", "/admin/products", "/admin/orders", "/admin/customers", "/admin/coupons", "/admin/reviews", "/admin/analytics", "/admin/settings"];

const cspHeader = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `img-src 'self' blob: data: https://images.unsplash.com https://picsum.photos https://assets.m4vx.com`,
  `font-src 'self' https://fonts.gstatic.com`,
  `connect-src 'self' https://api.stripe.com https://m.stripe.network`,
  `frame-src https://js.stripe.com https://hooks.stripe.com`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

function addSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "0");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Content-Security-Policy", cspHeader);
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limiting for auth pages
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "anonymous";
    const rl = rateLimit(`auth:${ip}`, { interval: 60000, maxRequests: 5 });
    if (!rl.success) {
      return new NextResponse("Too many requests. Please try again later.", { status: 429 });
    }
  }

  // Rate limiting for checkout
  if (pathname.startsWith("/checkout")) {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "anonymous";
    const rl = rateLimit(`checkout:${ip}`, { interval: 60000, maxRequests: 10 });
    if (!rl.success) {
      return new NextResponse("Too many requests. Please try again later.", { status: 429 });
    }
  }

  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  const isAuthPage = authPages.some((p) => pathname.startsWith(p));
  const isProtectedPage = protectedPages.some((p) => pathname.startsWith(p));
  const isAdminPage = adminPages.some((p) => pathname.startsWith(p));

  if (isAuthPage && sessionToken) {
    const response = NextResponse.redirect(new URL("/account", request.url));
    return addSecurityHeaders(response);
  }

  if (isProtectedPage && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    return addSecurityHeaders(response);
  }

  if (isAdminPage && !sessionToken) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    return addSecurityHeaders(response);
  }

  // Add noindex to admin and auth pages
  if (pathname.startsWith("/admin") || pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password")) {
    const response = NextResponse.next();
    addSecurityHeaders(response);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest).*)"],
};
