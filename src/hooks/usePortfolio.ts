import { useCallback, useEffect, useState } from 'react'
import { fetchPortfolio } from '../lib/fetchPortfolio'
import type { PortfolioData } from '../types/portfolio'

export function usePortfolio() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<'supabase' | 'fallback'>('fallback')
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchPortfolio()
      setData(result.data)
      setSource(result.source)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load portfolio')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, source, error, refetch }
}
