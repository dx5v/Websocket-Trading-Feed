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
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const shouldReconnectRef = useRef(false)
  const urlRef = useRef('')

  const clearReconnectTimeout = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }

  const scheduleReconnect = useCallback(() => {
    if (!shouldReconnectRef.current) return

    clearReconnectTimeout()

    const attempts = reconnectAttemptsRef.current
    const delay = Math.min(1000 * Math.pow(2, attempts), 30000) // Exponential backoff, max 30s

    console.log(`Reconnecting in ${delay / 1000}s (attempt ${attempts + 1})...`)
    
    setState(prev => ({
      ...prev,
      error: `Connection lost. Reconnecting in ${Math.round(delay / 1000)}s...`
    }))

    reconnectTimeoutRef.current = setTimeout(() => {
      if (shouldReconnectRef.current && urlRef.current) {
        reconnectAttemptsRef.current += 1
        connect(urlRef.current)
      }
    }, delay)
  }, [])

  const connect = useCallback((url: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close()
    }

    urlRef.current = url
    shouldReconnectRef.current = true
    clearReconnectTimeout()

    try {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket connected successfully')
        reconnectAttemptsRef.current = 0
        setState({
          isConnected: true,
          url,
          error: null
        })
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          // Check if it's a valid trade message
          if (
            data.id && 
            data.timestamp && 
            data.symbol && 
            typeof data.price === 'number' && 
            typeof data.size === 'number' && 
            data.side && 
            data.exchange
          ) {
            const trade: Trade = data
            setTrades(prev => [trade, ...prev].slice(0, 1000)) // Keep last 1000 trades
          } else {
            console.log('Non-trade message received:', data)
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.onerror = (event) => {
        console.error('WebSocket error:', event)
        setState(prev => ({
          ...prev,
          error: 'WebSocket connection error',
          isConnected: false
        }))
      }

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason)
        setState(prev => ({
          ...prev,
          isConnected: false
        }))

        // Only reconnect if it wasn't a manual disconnect
        if (shouldReconnectRef.current && event.code !== 1000) {
          scheduleReconnect()
        }
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create WebSocket connection',
        isConnected: false
      }))
      
      // Schedule reconnect on connection failure
      if (shouldReconnectRef.current) {
        scheduleReconnect()
      }
    }
  }, [scheduleReconnect])

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false
    clearReconnectTimeout()
    reconnectAttemptsRef.current = 0
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected')
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
      shouldReconnectRef.current = false
      clearReconnectTimeout()
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted')
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