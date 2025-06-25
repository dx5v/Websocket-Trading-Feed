'use client'

import { useState, useMemo } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { WebSocketControls } from '@/components/WebSocketControls'
import { StatisticsPanel } from '@/components/StatisticsPanel'
import { TradeFilters } from '@/components/TradeFilters'
import { SymbolPerformance } from '@/components/SymbolPerformance'
import { TradePanel } from '@/components/TradePanel'
import { FilterOptions, SortOptions, Trade } from '@/types/trade'

export default function Home() {
  const { state, trades, connect, disconnect, clearTrades } = useWebSocket()
  
  const [filters, setFilters] = useState<FilterOptions>({})
  const [sort, setSort] = useState<SortOptions>({
    field: 'timestamp',
    direction: 'desc'
  })

  const symbols = useMemo(() => {
    const uniqueSymbols = Array.from(new Set(trades.map(t => t.symbol)))
    return uniqueSymbols.sort()
  }, [trades])

  const exchanges = useMemo(() => {
    const uniqueExchanges = Array.from(new Set(trades.map(t => t.exchange)))
    return uniqueExchanges.sort()
  }, [trades])

  const filteredAndSortedTrades = useMemo(() => {
    let filtered = trades

    if (filters.symbol) {
      filtered = filtered.filter(t => t.symbol === filters.symbol)
    }
    if (filters.side) {
      filtered = filtered.filter(t => t.side === filters.side)
    }
    if (filters.exchange) {
      filtered = filtered.filter(t => t.exchange === filters.exchange)
    }

    return filtered.sort((a: Trade, b: Trade) => {
      let aValue: number | string = a[sort.field]
      let bValue: number | string = b[sort.field]

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }

      if (sort.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }, [trades, filters, sort])

  return (
    <main className="min-h-screen p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Live Trade Feed Dashboard
          </h1>
          <p className="text-text-secondary">
            Real-time WebSocket trading data with analytics and filtering
          </p>
        </header>

        <div className="grid gap-6">
          <WebSocketControls
            state={state}
            onConnect={connect}
            onDisconnect={disconnect}
            onClearTrades={clearTrades}
          />

          <StatisticsPanel trades={filteredAndSortedTrades} />

          <TradeFilters
            filters={filters}
            sort={sort}
            onFilterChange={setFilters}
            onSortChange={setSort}
            symbols={symbols}
            exchanges={exchanges}
          />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TradePanel trades={filteredAndSortedTrades} />
            </div>
            <div>
              <SymbolPerformance trades={filteredAndSortedTrades} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}