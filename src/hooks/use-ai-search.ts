"use client"

import { useState, useCallback, useRef } from "react"
import type { ShopProduct, ShopSearchResult } from "@/types/shop"
import type { ParsedQuery } from "@/server/services/ai-search-service"

interface AiSearchState {
  query: string
  results: ShopProduct[]
  totalCount: number
  totalPages: number
  isLoading: boolean
  parsedQuery: ParsedQuery | null
  error: string | null
}

interface UseAiSearchReturn extends AiSearchState {
  search: (query: string) => Promise<void>
  clear: () => void
}

export function useAiSearch(): UseAiSearchReturn {
  const [state, setState] = useState<AiSearchState>({
    query: "",
    results: [],
    totalCount: 0,
    totalPages: 0,
    isLoading: false,
    parsedQuery: null,
    error: null,
  })
  const abortRef = useRef<AbortController | null>(null)

  const search = useCallback(async (query: string) => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
    abortRef.current = new AbortController()

    if (!query.trim()) {
      setState((prev) => ({
        ...prev,
        query,
        results: [],
        totalCount: 0,
        totalPages: 0,
        isLoading: false,
        parsedQuery: null,
        error: null,
      }))
      return
    }

    setState((prev) => ({ ...prev, query, isLoading: true, error: null }))

    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        throw new Error("Search failed")
      }

      const data: ShopSearchResult & { parsedQuery: ParsedQuery } = await res.json()

      setState((prev) => ({
        ...prev,
        query,
        results: data.products,
        totalCount: data.totalCount,
        totalPages: data.totalPages,
        isLoading: false,
        parsedQuery: data.parsedQuery,
        error: null,
      }))
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
      setState((prev) => ({
        ...prev,
        query,
        isLoading: false,
        error: err instanceof Error ? err.message : "Search failed",
      }))
    }
  }, [])

  const clear = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
    setState({
      query: "",
      results: [],
      totalCount: 0,
      totalPages: 0,
      isLoading: false,
      parsedQuery: null,
      error: null,
    })
  }, [])

  return { ...state, search, clear }
}
