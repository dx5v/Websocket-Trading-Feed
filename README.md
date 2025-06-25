# Live Trade Feed Dashboard

A real-time cryptocurrency trade feed dashboard built with Next.js, TypeScript, and WebSockets. Features live statistics, filtering, sorting, and symbol performance analysis.

## Features

- **Real-time WebSocket Integration**: Connect to any WebSocket endpoint to stream live trade data
- **Live Statistics**: Total trades, buy volume, buy/sell counts
- **Advanced Filtering**: Filter by symbol, side (buy/sell), and exchange
- **Flexible Sorting**: Sort trades by price, timestamp, size, or symbol
- **Symbol Performance**: Top performing symbols with volume and trade statistics
- **Paginated Trade Panel**: Efficiently display large numbers of trades
- **Dark Theme**: Professional financial UI with accessibility features

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

5. **Connect to the mock server**:
   - Enter WebSocket URL: `ws://localhost:8080`
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

- **Mock Server**: `ws://localhost:8080` (when running mock server)
- **Binance BTC/USDT**: `wss://stream.binance.com:9443/ws/btcusdt@trade`
- **Binance ETH/USDT**: `wss://stream.binance.com:9443/ws/ethusdt@trade`

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Static type checking
- **Tailwind CSS v3**: Utility-first CSS framework
- **WebSocket**: Real-time communication
- **React Hooks**: State management and lifecycle

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles and CSS variables
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── StatisticsPanel.tsx  # Live trade statistics
│   ├── TradeFilters.tsx     # Filter and sort controls
│   ├── SymbolPerformance.tsx # Symbol performance analysis
│   ├── TradePanel.tsx       # Paginated trade list
│   └── WebSocketControls.tsx # WebSocket connection controls
├── hooks/
│   └── useWebSocket.ts      # WebSocket state management
├── types/
│   └── trade.ts             # TypeScript type definitions
├── mock-ws-server.js        # Mock WebSocket server
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run mock-server` - Start mock WebSocket server

## Development Workflow

1. Start the mock server: `npm run mock-server`
2. Start the Next.js app: `npm run dev`
3. Connect to `ws://localhost:8080` in the app
4. Watch live trade data flow through the dashboard

## Deployment

Deploy easily to Vercel:

```bash
vercel deploy
```

Or any other platform that supports Next.js applications.

## Configuration

The application uses Tailwind CSS custom colors defined in `tailwind.config.js`. The dark theme colors are:

- Background: `#0F1115`
- Surface: `#1A1D23`
- Buy color: `#00C896`
- Sell color: `#FF5F5F`

## Browser Support

- Modern browsers with WebSocket support
- Chrome, Firefox, Safari, Edge (latest versions)

## License

MIT License - see LICENSE file for details.