const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const PORT = 8080;

// Trading symbols with realistic price ranges
const SYMBOLS = [
  { symbol: 'BTC/USD', basePrice: 65000, volatility: 0.02 },
  { symbol: 'ETH/USD', basePrice: 3500, volatility: 0.025 },
  { symbol: 'SOL/USD', basePrice: 180, volatility: 0.04 },
  { symbol: 'ADA/USD', basePrice: 0.45, volatility: 0.03 },
  { symbol: 'DOT/USD', basePrice: 6.5, volatility: 0.035 },
  { symbol: 'LINK/USD', basePrice: 14.2, volatility: 0.03 },
  { symbol: 'MATIC/USD', basePrice: 0.85, volatility: 0.04 },
  { symbol: 'UNI/USD', basePrice: 8.5, volatility: 0.035 }
];

const EXCHANGES = ['Binance', 'Coinbase', 'Kraken', 'Bitfinex', 'Gemini'];

// Track current prices for each symbol
const currentPrices = {};
SYMBOLS.forEach(({ symbol, basePrice }) => {
  currentPrices[symbol] = basePrice;
});

function generateRealisticPrice(symbol) {
  const symbolData = SYMBOLS.find(s => s.symbol === symbol);
  if (!symbolData) return 1000;

  const { volatility } = symbolData;
  const currentPrice = currentPrices[symbol];
  
  // Generate price movement (-volatility% to +volatility%)
  const change = (Math.random() - 0.5) * 2 * volatility;
  const newPrice = currentPrice * (1 + change);
  
  // Update current price
  currentPrices[symbol] = newPrice;
  
  return Math.round(newPrice * 100) / 100;
}

function generateTradeSize(symbol) {
  // Different size ranges for different symbols
  if (symbol.includes('BTC')) {
    return Math.round((Math.random() * 2 + 0.01) * 10000) / 10000; // 0.01 - 2 BTC
  } else if (symbol.includes('ETH')) {
    return Math.round((Math.random() * 10 + 0.1) * 1000) / 1000; // 0.1 - 10 ETH
  } else {
    return Math.round((Math.random() * 1000 + 1) * 100) / 100; // 1 - 1000 for other coins
  }
}

function generateTrade() {
  const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].symbol;
  const price = generateRealisticPrice(symbol);
  const size = generateTradeSize(symbol);
  const side = Math.random() > 0.52 ? 'buy' : 'sell'; // Slightly more buys than sells
  const exchange = EXCHANGES[Math.floor(Math.random() * EXCHANGES.length)];

  return {
    id: uuidv4(),
    timestamp: Date.now(),
    symbol,
    price,
    size,
    side,
    exchange
  };
}

// Create WebSocket server
const wss = new WebSocket.Server({ port: PORT });

console.log(`🚀 Mock WebSocket server running on ws://localhost:${PORT}`);
console.log('📊 Generating realistic trade data...');
console.log('💡 Connect your app to: ws://localhost:8080');

wss.on('connection', (ws) => {
  console.log('📱 Client connected');

  // Send initial trades burst
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        const trade = generateTrade();
        ws.send(JSON.stringify(trade));
        console.log(`📈 ${trade.side.toUpperCase()} ${trade.symbol} ${trade.price} x ${trade.size} (${trade.exchange})`);
      }
    }, i * 200);
  }

  // Send trades at random intervals (1-3 seconds)
  const sendTrade = () => {
    if (ws.readyState === WebSocket.OPEN) {
      const trade = generateTrade();
      ws.send(JSON.stringify(trade));
      console.log(`📈 ${trade.side.toUpperCase()} ${trade.symbol} ${trade.price} x ${trade.size} (${trade.exchange})`);
      
      // Schedule next trade
      const nextInterval = Math.random() * 2000 + 1000; // 1-3 seconds
      setTimeout(sendTrade, nextInterval);
    }
  };

  // Start sending trades after initial burst
  setTimeout(sendTrade, 1000);

  ws.on('close', () => {
    console.log('📱 Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down mock WebSocket server...');
  wss.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Display current prices every 10 seconds
setInterval(() => {
  console.log('\n💰 Current Prices:');
  Object.entries(currentPrices).forEach(([symbol, price]) => {
    console.log(`   ${symbol}: $${price.toFixed(2)}`);
  });
  console.log('');
}, 10000);