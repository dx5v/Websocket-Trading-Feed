# Live Trade Feed Dashboard

A production-ready cryptocurrency trade feed dashboard built with Next.js, TypeScript, and WebSockets. Features real-time data streaming, automatic reconnection, advanced analytics, and a professional dark-themed UI.

## Features

- **Real-time WebSocket Integration**: Connect to any WebSocket endpoint to stream live trade data
- **Automatic Reconnection**: Smart reconnection with exponential backoff (1s, 2s, 4s... max 30s)
- **Live Statistics Panel**: Real-time metrics including total trades, buy volume, and buy/sell counts
- **Advanced Filtering**: Filter trades by symbol, side (buy/sell), and exchange
- **Flexible Sorting**: Sort trades by price, timestamp, size, or symbol
- **Symbol Performance Cards**: Visual cards showing top performers with pagination
- **Paginated Trade Panel**: Efficiently display large volumes of trades with 20 per page
- **Dark Theme**: Professional financial UI with carefully crafted color scheme
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Type-Safe**: Full TypeScript implementation with proper type definitions

## Trade Data Format

The application expects WebSocket messages in the following format:

```json
{
  "id": "ba9fef23-91a0-45db-9cf1-e65e1706d232",
  "timestamp": 1718911830000,
  "symbol": "ETH/USD",
  "price": 3568.12,
  "size": 2.5,
  "side": "buy",
  "exchange": "Coinbase"
}
```

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the mock WebSocket server** (in one terminal):
   ```bash
   npm run mock-server
   ```

3. **Run the development server** (in another terminal):
   ```bash
   npm run dev
   ```

4. **Open the application**:
   Navigate to `http://localhost:3000`

5. **Connect to WebSocket server**:
   - Default URL: `wss://websocket-trading-feed.onrender.com` (production server)
   - Local URL: `ws://localhost:8080` (when running mock server)
   - Click "Connect" to start receiving live trade data

## Mock WebSocket Server

The included mock server generates realistic trade data with:

- **8 Popular Symbols**: BTC/USD, ETH/USD, SOL/USD, ADA/USD, DOT/USD, LINK/USD, MATIC/USD, UNI/USD
- **5 Exchanges**: Binance, Coinbase, Kraken, Bitfinex, Gemini
- **Realistic Price Movements**: Based on volatility patterns
- **Variable Trade Sizes**: Different ranges per symbol type
- **Random Intervals**: 1-3 seconds between trades

Run the mock server with: `npm run mock-server`

## Example WebSocket URLs

- **Production Server**: `wss://websocket-trading-feed.onrender.com` (default, always available)
- **Local Mock Server**: `ws://localhost:8080` (when running mock server locally)

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Static type checking
- **Tailwind CSS v3**: Utility-first CSS framework
- **WebSocket**: Real-time communication
- **React Hooks**: State management and lifecycle

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles with dark theme
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── StatisticsPanel.tsx  # Live trade statistics with auto-updating metrics
│   ├── TradeFilters.tsx     # Advanced filter and sort controls
│   ├── SymbolPerformance.tsx # Symbol cards with pagination (5 per page)
│   ├── TradePanel.tsx       # Paginated trade table (20 per page)
│   └── WebSocketControls.tsx # Connection management with status indicators
├── hooks/
│   └── useWebSocket.ts      # WebSocket with auto-reconnection logic
├── types/
│   └── trade.ts             # TypeScript interfaces for type safety
├── websocket-server/        # Production WebSocket server for Render.com
│   ├── server.js            # WebSocket server with broadcasting
│   ├── package.json         # Server dependencies
│   └── render.yaml          # Render.com deployment config
├── mock-ws-server.js        # Local development WebSocket server
└── README.md                # This file
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run mock-server` - Start mock WebSocket server

## Key Features Explained

### Automatic Reconnection
The WebSocket connection includes smart reconnection logic:
- Exponential backoff: 1s → 2s → 4s → 8s → 16s → max 30s
- Distinguishes between manual disconnects and connection drops
- Shows reconnection status in the UI
- Prevents reconnection during component unmount

### Symbol Performance Cards
- Displays top 10 symbols by volume
- Paginated view with 5 symbols per page
- Shows volume, trade count, average price, and buy/sell ratio
- Visual indicators for bullish (green) or bearish (red) sentiment

### Trade Panel
- Real-time trade feed with 20 trades per page
- Color-coded buy (green) and sell (red) indicators
- Formatted timestamps, prices, and volumes
- Proper column spacing for readability

### Live Statistics
- Updates in real-time as trades arrive
- Formatted numbers (K for thousands, M for millions)
- Buy volume in USD
- Separate buy and sell counts

## Configuration

The application uses a carefully designed dark theme:

- **Background**: `#0F1115` - Deep dark blue
- **Surface**: `#1A1D23` - Card backgrounds
- **Buy/Green**: `#00C896` - Positive actions
- **Sell/Red**: `#FF5F5F` - Negative actions
- **Text Primary**: `#F0F3F8` - Main text
- **Text Secondary**: `#A6B0C3` - Muted text

## License

MIT License - see LICENSE file for details.