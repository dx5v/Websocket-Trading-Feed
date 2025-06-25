'use client'

import { FilterOptions, SortOptions } from '@/types/trade'

interface TradeFiltersProps {
  filters: FilterOptions
  sort: SortOptions
  onFilterChange: (filters: FilterOptions) => void
  onSortChange: (sort: SortOptions) => void
  symbols: string[]
  exchanges: string[]
}

export function TradeFilters({
  filters,
  sort,
  onFilterChange,
  onSortChange,
  symbols,
  exchanges
}: TradeFiltersProps) {
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value === '' ? undefined : value
    })
  }

  const handleSortChange = (field: string) => {
    const newDirection = sort.field === field && sort.direction === 'desc' ? 'asc' : 'desc'
    onSortChange({
      field: field as SortOptions['field'],
      direction: newDirection
    })
  }

  return (
    <div className="bg-bg-surface border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Filters & Sort</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm text-text-secondary mb-2">Symbol</label>
          <select
            value={filters.symbol || ''}
            onChange={(e) => handleFilterChange('symbol', e.target.value)}
            className="w-full p-2 bg-input-bg border border-filter-border rounded text-text-primary focus:border-buy focus:outline-none"
          >
            <option value="">All Symbols</option>
            {symbols.map(symbol => (
              <option key={symbol} value={symbol}>{symbol}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Side</label>
          <select
            value={filters.side || ''}
            onChange={(e) => handleFilterChange('side', e.target.value)}
            className="w-full p-2 bg-input-bg border border-filter-border rounded text-text-primary focus:border-buy focus:outline-none"
          >
            <option value="">All Sides</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Exchange</label>
          <select
            value={filters.exchange || ''}
            onChange={(e) => handleFilterChange('exchange', e.target.value)}
            className="w-full p-2 bg-input-bg border border-filter-border rounded text-text-primary focus:border-buy focus:outline-none"
          >
            <option value="">All Exchanges</option>
            {exchanges.map(exchange => (
              <option key={exchange} value={exchange}>{exchange}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-2">Sort By</label>
          <div className="flex gap-2">
            {['price', 'timestamp', 'size', 'symbol'].map(field => (
              <button
                key={field}
                onClick={() => handleSortChange(field)}
                className={`px-3 py-2 text-xs rounded transition-colors ${
                  sort.field === field
                    ? 'bg-buy text-white'
                    : 'bg-bg-accent text-text-secondary hover:bg-bg-hover'
                }`}
              >
                {field}
                {sort.field === field && (
                  <span className="ml-1">
                    {sort.direction === 'desc' ? '↓' : '↑'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}