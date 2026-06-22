import { NextRequest, NextResponse } from "next/server"
import { aiSearch, parseSearchQuery } from "@/server/services/ai-search-service"
import { rateLimitByIp } from "@/lib/rate-limit"
import { searchQuerySchema } from "@/lib/validations"

export async function POST(req: NextRequest) {
  const rl = rateLimitByIp(req, { interval: 60000, maxRequests: 30 })
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const body = await req.json()
    const parsed = searchQuerySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid search query" },
        { status: 400 }
      )
    }

    const parsedQuery = parseSearchQuery(parsed.data.query)

    if (!parsedQuery.keywords && !parsedQuery.categorySlug && !parsedQuery.color && !parsedQuery.tags?.length) {
      return NextResponse.json({
        products: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        parsedQuery,
      })
    }

    const result = await aiSearch(parsed.data.query)

    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    )
  }
}
