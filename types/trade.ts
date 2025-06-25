export interface Trade {
  id: string;
  timestamp: number;
  symbol: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  exchange: string;
}

export interface SymbolStats {
  symbol: string;
  totalVolume: number;
  tradeCount: number;
  averagePrice: number;
  buyCount: number;
  sellCount: number;
  buyRatio: number;
}

export interface TradeStats {
  totalTrades: number;
  buyVolume: number;
  sellCount: number;
  buyCount: number;
}

export interface FilterOptions {
  symbol?: string;
  side?: 'buy' | 'sell' | '';
  exchange?: string;
}

export interface SortOptions {
  field: 'price' | 'timestamp' | 'size' | 'symbol';
  direction: 'asc' | 'desc';
}

export interface WebSocketState {
  isConnected: boolean;
  url: string;
  error: string | null;
}