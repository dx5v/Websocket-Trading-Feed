# Live Trade Feed App - Technical Documentation

## ✨ Overview

This application is a real-time trade feed dashboard built with **Next.js** and **TypeScript**, featuring a **WebSocket-based live data stream**. Users can input a WebSocket URL to stream trades, with enhanced capabilities:

- Real-time trade rendering
- Live statistics (total trades, buy volume, sell count)
- Sort and filter controls
- Symbol performance analysis
- Paginated trade panel
- Accessible dark-themed financial UI

Sample data input from WebSocket:

type Trade = {
  id: string;               // Unique identifier (e.g. UUID)
  timestamp: number;        // Unix timestamp in milliseconds
  symbol: string;           // e.g. 'BTC/USD', 'ETH/USD'
  price: number;            // Trade price
  size: number;             // Trade size
  side: 'buy' | 'sell';     // Trade direction
  exchange: string;         // e.g. 'Binance', 'Coinbase'
};

{
  "id": "ba9fef23-91a0-45db-9cf1-e65e1706d232",
  "timestamp": 1718911830000,
  "symbol": "ETH/USD",
  "price": 3568.12,
  "size": 2.5,
  "side": "buy",
  "exchange": "Coinbase"
}

---

## 🔧 Tech Stack

| Technology      | Purpose                         |
| --------------- | ------------------------------- |
| Next.js         | Application framework           |
| TypeScript      | Static typing                   |
| Tailwind CSS v4 | Styling + custom property theme |
| WebSocket       | Real-time trade feed            |
| CSS Variables   | Theming and customization       |

---

## 📊 Feature Modules

### 1. 📈 Live Statistics Panel

Tracks in real-time:

- Total trades
- Buy trade count and USD volume
- Sell trade count

```ts
const total = trades.length;
const buyVolume = trades.filter(t => t.side === 'buy').reduce((sum, t) => sum + (t.price * t.size), 0);
const sellCount = trades.filter(t => t.side === 'sell').length;
```

### 2. 📝 Trade Filter + Sort

Component provides controls to:

- Filter by symbol, side, exchange
- Sort by price, timestamp, size
- Combine both filter + sort

### 3. 🔄 Symbol Performance

Calculates:

- Total volume
- Trade count
- Average price
- Buy/sell ratio per symbol pair

```ts
const performanceMap = new Map<string, SymbolStats>();
trades.forEach(t => {
  // Update stats per symbol
});
```

### 4. 📲 Live Trade Panel (Paginated)

- Renders trades in reverse chronological order
- Uses client-side pagination for performance
- Configurable page size (default: 20)

```ts
const currentPageTrades = trades.slice(startIdx, endIdx);
```

---

## 🎨 Color Theme and Styling

### 🛋 Design System

Dark UI with CSS custom properties, built on Tailwind CSS v4 with utility-class integration.

### 🖊️ Color Palette

- **Background Primary**: `#0F1115`

- **Surface**: `#1A1D23`

- **Hover**: `#20252B`

- **Accent**: `#14171C`

- **Text Primary**: `#F0F3F8`

- **Text Secondary**: `#A6B0C3`

- **Muted**: `#606B7A`

- **Buy**: `#00C896`

- **Buy BG**: `rgba(0, 200, 150, 0.08)`

- **Sell**: `#FF5F5F`

- **Sell BG**: `rgba(255, 95, 95, 0.08)`

- **Borders**: `#2C313A`

- **Divider**: `#3A3F4B`

- **Input BG**: `#1F232A`

- **Filter Border**: `#4A5568`

### 🌇 CSS Variables

```css
:root {
  --color-bg-primary: #0F1115;
  --color-bg-surface: #1A1D23;
  --color-text-primary: #F0F3F8;
  --color-buy: #00C896;
  --color-sell: #FF5F5F;
  /* etc. */
}
```

### 🖌️ Component Styling

```tsx
style={{
  backgroundColor: 'var(--color-bg-surface)',
  color: 'var(--color-text-primary)',
  border: '1px solid var(--color-border)'
}}
```

---

## ♻️ Accessibility

- WCAG AA contrast ratios met
- Clear focus states for keyboard users
- Color + position + text used to differentiate buy/sell

---

## 🚀 Deployment

- Deploy using Vercel or Netlify
- Add `vercel.json` for custom headers, if needed
- Use `.env` for dynamic WebSocket base URLs (optional)

---

## 🚪 Final Notes

- Ensure all components are reusable and typed
- Gracefully handle edge cases (invalid URL, disconnected WebSocket)
- Keep UI responsive and visually clean under high-volume traffic

