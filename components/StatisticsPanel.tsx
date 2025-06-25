'use client'

import { Trade, TradeStats } from '@/types/trade'
import { useMemo } from 'react'

interface StatisticsPanelProps {
  trades: Trade[]
}

export function StatisticsPanel({ trades }: StatisticsPanelProps) {
  const stats = useMemo<TradeStats>(() => {
    const total = trades.length
    const buyTrades = trades.filter(t => t.side === 'buy')
    const sellTrades = trades.filter(t => t.side === 'sell')
    
    const buyVolume = buyTrades.reduce((sum, t) => sum + (t.price * t.size), 0)
    const sellCount = sellTrades.length
    const buyCount = buyTrades.length

    return {
      totalTrades: total,
      buyVolume,
      sellCount,
      buyCount
    }
  }, [trades])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`
    }
    return num.toLocaleString()
  }

  const formatCurrency = (num: number) => {
    return `$${formatNumber(num)}`
  }

  return (
    <div className="bg-bg-surface border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-4">Live Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-bg-accent p-4 rounded-lg">
          <div className="text-text-secondary text-sm">Total Trades</div>
          <div className="text-2xl font-bold text-text-primary">
            {formatNumber(stats.totalTrades)}
          </div>
        </div>

        <div className="bg-buy-bg p-4 rounded-lg border border-buy/20">
          <div className="text-text-secondary text-sm">Buy Volume</div>
          <div className="text-2xl font-bold text-buy">
            {formatCurrency(stats.buyVolume)}
          </div>
        </div>

        <div className="bg-buy-bg p-4 rounded-lg border border-buy/20">
          <div className="text-text-secondary text-sm">Buy Count</div>
          <div className="text-2xl font-bold text-buy">
            {formatNumber(stats.buyCount)}
          </div>
        </div>

        <div className="bg-sell-bg p-4 rounded-lg border border-sell/20">
          <div className="text-text-secondary text-sm">Sell Count</div>
          <div className="text-2xl font-bold text-sell">
            {formatNumber(stats.sellCount)}
          </div>
        </div>
      </div>
    </div>
  )
}