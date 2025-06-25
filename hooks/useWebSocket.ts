'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Trade, WebSocketState } from '@/types/trade'

export function useWebSocket() {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    url: '',
    error: null
  })
  
  const [trades, setTrades] = useState<Trade[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  const connect = useCallback((url: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close()
    }

    try {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        setState({
          isConnected: true,
          url,
          error: null
        })
      }

      ws.onmessage = (event) => {
        try {
          const trade: Trade = JSON.parse(event.data)
          setTrades(prev => [trade, ...prev].slice(0, 1000)) // Keep last 1000 trades
        } catch (error) {
          console.error('Failed to parse trade data:', error)
        }
      }

      ws.onerror = () => {
        setState(prev => ({
          ...prev,
          error: 'WebSocket connection error'
        }))
      }

      ws.onclose = () => {
        setState(prev => ({
          ...prev,
          isConnected: false
        }))
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create WebSocket connection'
      }))
    }
  }, [])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setState({
      isConnected: false,
      url: '',
      error: null
    })
  }, [])

  const clearTrades = useCallback(() => {
    setTrades([])
  }, [])

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  return {
    state,
    trades,
    connect,
    disconnect,
    clearTrades
  }
}