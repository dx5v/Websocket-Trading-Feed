'use client'

import { Trade, SymbolStats } from '@/types/trade'
import { useMemo, useState } from 'react'

interface SymbolPerformanceProps {
  trades: Trade[]
}

export function SymbolPerformance({ trades }: SymbolPerformanceProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5 // Show 5 symbols per page
  
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

  // Pagination calculations
  const totalPages = Math.ceil(symbolStats.length / pageSize)
  const startIdx = (currentPage - 1) * pageSize
  const endIdx = startIdx + pageSize
  const currentPageStats = symbolStats.slice(startIdx, endIdx)

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Symbol Performance</h3>
        <div className="text-sm text-text-secondary">
          {symbolStats.length} symbols
        </div>
      </div>
      
      <div className="space-y-3">
        {currentPageStats.map((stat, index) => (
          <div
            key={stat.symbol}
            className="bg-bg-accent border border-border rounded-lg p-4 hover:bg-bg-hover transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="text-xs bg-bg-primary text-text-secondary px-2 py-1 rounded mr-2">
                  #{startIdx + index + 1}
                </span>
                <span className="font-semibold text-text-primary">{stat.symbol}</span>
              </div>
              <span className={`text-sm font-bold ${stat.buyRatio > 0.5 ? 'text-buy' : 'text-sell'}`}>
                {formatPercentage(stat.buyRatio)}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-text-muted">Volume</div>
                <div className="text-text-primary font-medium">{formatCurrency(stat.totalVolume)}</div>
              </div>
              <div>
                <div className="text-text-muted">Trades</div>
                <div className="text-text-primary font-medium">{formatNumber(stat.tradeCount)}</div>
              </div>
              <div>
                <div className="text-text-muted">Avg Price</div>
                <div className="text-text-primary font-medium">{formatPrice(stat.averagePrice)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-divider">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-xs bg-bg-accent text-text-primary rounded border border-border hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-1">
            <span className="text-xs text-text-secondary">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-xs bg-bg-accent text-text-primary rounded border border-border hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}