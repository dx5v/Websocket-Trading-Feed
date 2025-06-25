'use client'

import { useState } from 'react'
import { WebSocketState } from '@/types/trade'

interface WebSocketControlsProps {
  state: WebSocketState
  onConnect: (url: string) => void
  onDisconnect: () => void
  onClearTrades: () => void
}

export function WebSocketControls({
  state,
  onConnect,
  onDisconnect,
  onClearTrades
}: WebSocketControlsProps) {
  const [url, setUrl] = useState('wss://stream.binance.com:9443/ws/btcusdt@trade')

  const handleConnect = () => {
    if (url.trim()) {
      onConnect(url.trim())
    }
  }

  const handleDisconnect = () => {
    onDisconnect()
  }

  return (
    <div className="bg-bg-surface border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-4">WebSocket Connection</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-text-secondary mb-2">
            WebSocket URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="wss://example.com/ws"
            disabled={state.isConnected}
            className="w-full p-3 bg-input-bg border border-filter-border rounded text-text-primary placeholder-text-muted focus:border-buy focus:outline-none disabled:opacity-50"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                state.isConnected ? 'bg-buy' : 'bg-sell'
              }`}
            />
            <span className="text-sm text-text-secondary">
              {state.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {state.isConnected ? (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-sell text-white rounded hover:bg-sell/80 transition-colors"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={!url.trim()}
              className="px-4 py-2 bg-buy text-white rounded hover:bg-buy/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Connect
            </button>
          )}

          <button
            onClick={onClearTrades}
            className="px-4 py-2 bg-bg-accent text-text-primary border border-border rounded hover:bg-bg-hover transition-colors"
          >
            Clear Trades
          </button>
        </div>

        {state.error && (
          <div className="p-3 bg-sell-bg border border-sell/20 rounded text-sell text-sm">
            {state.error}
          </div>
        )}

        {state.isConnected && state.url && (
          <div className="p-3 bg-buy-bg border border-buy/20 rounded text-buy text-sm">
            Connected to: {state.url}
          </div>
        )}
      </div>
    </div>
  )
}