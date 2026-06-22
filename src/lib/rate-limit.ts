type RateLimitConfig = {
  interval: number
  maxRequests: number
}

const limits = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, config: RateLimitConfig): { success: boolean; remaining: number } {
  const now = Date.now()
  const entry = limits.get(key)

  if (!entry || now > entry.resetAt) {
    limits.set(key, { count: 1, resetAt: now + config.interval })
    return { success: true, remaining: config.maxRequests - 1 }
  }

  if (entry.count >= config.maxRequests) {
    return { success: false, remaining: 0 }
  }

  entry.count++
  return { success: true, remaining: config.maxRequests - entry.count }
}

export function rateLimitByIp(
  request: Request,
  config: RateLimitConfig
): { success: boolean; remaining: number } {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() ?? "anonymous"
  return rateLimit(`ip:${ip}`, config)
}

export function rateLimitByUserId(
  userId: string,
  config: RateLimitConfig
): { success: boolean; remaining: number } {
  return rateLimit(`user:${userId}`, config)
}
