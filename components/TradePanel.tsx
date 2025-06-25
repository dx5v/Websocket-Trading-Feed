'use client'

import { Trade } from '@/types/trade'
import { useState } from 'react'

interface TradePanelProps {
  trades: Trade[]
}

export function TradePanel({ trades }: TradePanelProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20
  const totalPages = Math.ceil(trades.length / pageSize)
  
  const startIdx = (currentPage - 1) * pageSize
  const endIdx = startIdx + pageSize
  const currentPageTrades = trades.slice(startIdx, endIdx)

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatSize = (size: number) => {
    return size.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })
  }

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }

  if (trades.length === 0) {
    return (
      <div className="bg-bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Live Trades</h3>
        <div className="text-text-secondary text-center py-12">
          No trades available. Connect to a WebSocket to start receiving trade data.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-surface border border-border rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Live Trades</h3>
        <div className="text-sm text-text-secondary">
          {trades.length} total trades
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-divider">
              <th className="text-left py-3 text-text-secondary font-medium">Time</th>
              <th className="text-left py-3 text-text-secondary font-medium">Symbol</th>
              <th className="text-left py-3 text-text-secondary font-medium">Side</th>
              <th className="text-right py-3 text-text-secondary font-medium">Price</th>
              <th className="text-right py-3 text-text-secondary font-medium">Size</th>
              <th className="text-right py-3 pr-6 text-text-secondary font-medium">Volume</th>
              <th className="text-left py-3 pl-6 text-text-secondary font-medium">Exchange</th>
            </tr>
          </thead>
          <tbody>
            {currentPageTrades.map(trade => (
              <tr key={trade.id} className="border-b border-divider/50 hover:bg-bg-hover">
                <td className="py-3 text-text-secondary text-sm">
                  {formatTime(trade.timestamp)}
                </td>
                <td className="py-3 text-text-primary font-medium">
                  {trade.symbol}
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      trade.side === 'buy'
                        ? 'bg-buy-bg text-buy border border-buy/20'
                        : 'bg-sell-bg text-sell border border-sell/20'
                    }`}
                  >
                    {trade.side.toUpperCase()}
                  </span>
                </td>
                <td className="text-right py-3 text-text-primary font-medium">
                  {formatPrice(trade.price)}
                </td>
                <td className="text-right py-3 text-text-primary">
                  {formatSize(trade.size)}
                </td>
                <td className="text-right py-3 pr-6 text-text-primary">
                  {formatPrice(trade.price * trade.size)}
                </td>
                <td className="py-3 pl-6 text-text-secondary">
                  {trade.exchange}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-divider">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm bg-bg-accent text-text-primary rounded border border-border hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm bg-bg-accent text-text-primary rounded border border-border hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}