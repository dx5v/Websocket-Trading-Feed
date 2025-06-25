'use client'

import { Trade, SymbolStats } from '@/types/trade'
import { useMemo } from 'react'

interface SymbolPerformanceProps {
  trades: Trade[]
}

export function SymbolPerformance({ trades }: SymbolPerformanceProps) {
  const symbolStats = useMemo<SymbolStats[]>(() => {
    const performanceMap = new Map<string, SymbolStats>()

    trades.forEach(trade => {
      const existing = performanceMap.get(trade.symbol)
      
      if (existing) {
        existing.totalVolume += trade.price * trade.size
        existing.tradeCount += 1
        existing.averagePrice = (existing.averagePrice * (existing.tradeCount - 1) + trade.price) / existing.tradeCount
        
        if (trade.side === 'buy') {
          existing.buyCount += 1
        } else {
          existing.sellCount += 1
        }
        
        existing.buyRatio = existing.buyCount / existing.tradeCount
      } else {
        performanceMap.set(trade.symbol, {
          symbol: trade.symbol,
          totalVolume: trade.price * trade.size,
          tradeCount: 1,
          averagePrice: trade.price,
          buyCount: trade.side === 'buy' ? 1 : 0,
          sellCount: trade.side === 'sell' ? 1 : 0,
          buyRatio: trade.side === 'buy' ? 1 : 0
        })
      }
    })

    return Array.from(performanceMap.values())
      .sort((a, b) => b.totalVolume - a.totalVolume)
      .slice(0, 10)
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

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatPercentage = (ratio: number) => {
    return `${(ratio * 100).toFixed(1)}%`
  }

  if (symbolStats.length === 0) {
    return (
      <div className="bg-bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Symbol Performance</h3>
        <div className="text-text-secondary text-center py-8">
          No trade data available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-surface border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Symbol Performance</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-divider">
              <th className="text-left py-3 pr-4 text-text-secondary font-medium">Symbol</th>
              <th className="text-right py-3 px-3 text-text-secondary font-medium">Volume</th>
              <th className="text-right py-3 px-3 text-text-secondary font-medium">Trades</th>
              <th className="text-right py-3 px-3 text-text-secondary font-medium">Avg Price</th>
              <th className="text-right py-3 pl-3 text-text-secondary font-medium whitespace-nowrap">Buy Ratio</th>
            </tr>
          </thead>
          <tbody>
            {symbolStats.map((stat, index) => (
              <tr key={stat.symbol} className="border-b border-divider/50 hover:bg-bg-hover">
                <td className="py-3 pr-4">
                  <div className="flex items-center">
                    <span className="text-xs bg-bg-accent text-text-secondary px-2 py-1 rounded mr-2">
                      #{index + 1}
                    </span>
                    <span className="font-medium text-text-primary">{stat.symbol}</span>
                  </div>
                </td>
                <td className="text-right py-3 px-3 text-text-primary font-medium">
                  {formatCurrency(stat.totalVolume)}
                </td>
                <td className="text-right py-3 px-3 text-text-primary">
                  {formatNumber(stat.tradeCount)}
                </td>
                <td className="text-right py-3 px-3 text-text-primary">
                  {formatPrice(stat.averagePrice)}
                </td>
                <td className="text-right py-3 pl-3">
                  <span className={`font-medium ${stat.buyRatio > 0.5 ? 'text-buy' : 'text-sell'}`}>
                    {formatPercentage(stat.buyRatio)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}