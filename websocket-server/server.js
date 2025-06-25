const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

// Use environment port or default to 8080
const PORT = process.env.PORT || 8080;

// Trading symbols with realistic price ranges
const SYMBOLS = [
  { symbol: 'BTC/USD', basePrice: 65000, volatility: 0.02 },
  { symbol: 'ETH/USD', basePrice: 3500, volatility: 0.025 },
  { symbol: 'SOL/USD', basePrice: 180, volatility: 0.04 },
  { symbol: 'ADA/USD', basePrice: 0.45, volatility: 0.03 },
  { symbol: 'DOT/USD', basePrice: 6.5, volatility: 0.035 },
  { symbol: 'LINK/USD', basePrice: 14.2, volatility: 0.03 },
  { symbol: 'MATIC/USD', basePrice: 0.85, volatility: 0.04 },
  { symbol: 'UNI/USD', basePrice: 8.5, volatility: 0.035 },
  { symbol: 'AVAX/USD', basePrice: 35.0, volatility: 0.045 },
  { symbol: 'ATOM/USD', basePrice: 12.5, volatility: 0.04 }
];

const EXCHANGES = ['Binance', 'Coinbase', 'Kraken', 'Bitfinex', 'Gemini', 'KuCoin'];

// Track current prices for each symbol
const currentPrices = {};
SYMBOLS.forEach(({ symbol, basePrice }) => {
  currentPrices[symbol] = basePrice;
});

// Store connected clients
const clients = new Set();

function generateRealisticPrice(symbol) {
  const symbolData = SYMBOLS.find(s => s.symbol === symbol);
  if (!symbolData) return 1000;

  const { volatility } = symbolData;
  const currentPrice = currentPrices[symbol];
  
  // Generate price movement (-volatility% to +volatility%)
  const change = (Math.random() - 0.5) * 2 * volatility;
  const newPrice = currentPrice * (1 + change);
  
  // Update current price with some momentum
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

function broadcastTrade() {
  if (clients.size === 0) return;

  const trade = generateTrade();
  const message = JSON.stringify(trade);

  // Broadcast to all connected clients
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });

  console.log(`📈 Broadcasted: ${trade.side.toUpperCase()} ${trade.symbol} $${trade.price} x ${trade.size} (${trade.exchange}) to ${clients.size} clients`);
}

// Create WebSocket server
const wss = new WebSocket.Server({ 
  port: PORT,
  perMessageDeflate: false // Disable compression for better performance
});

console.log(`🚀 Trade Feed WebSocket Server running on port ${PORT}`);
console.log(`📊 Broadcasting realistic trade data for ${SYMBOLS.length} symbols`);
console.log(`🌐 Server URL: ws://localhost:${PORT} (local) or wss://your-render-url.onrender.com (deployed)`);

wss.on('connection', (ws, request) => {
  const clientIP = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
  console.log(`📱 Client connected from ${clientIP}. Total clients: ${clients.size + 1}`);
  
  // Add client to set
  clients.add(ws);

  // Send initial welcome message with server info
  const welcomeMessage = {
    type: 'server_info',
    message: 'Connected to Trade Feed Server',
    symbols: SYMBOLS.map(s => s.symbol),
    exchanges: EXCHANGES,
    timestamp: Date.now()
  };
  
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(welcomeMessage));
  }

  // Send initial burst of trades
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        const trade = generateTrade();
        ws.send(JSON.stringify(trade));
      }
    }, i * 300);
  }

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`📱 Client disconnected. Total clients: ${clients.size}`);
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
    clients.delete(ws);
  });

  // Handle ping/pong for connection health
  ws.on('pong', () => {
    ws.isAlive = true;
  });
  
  ws.isAlive = true;
});

// Broadcast trades at regular intervals
let broadcastInterval;

function startBroadcasting() {
  if (broadcastInterval) {
    clearInterval(broadcastInterval);
  }
  
  broadcastInterval = setInterval(() => {
    if (clients.size > 0) {
      broadcastTrade();
    }
  }, 1500); // Broadcast every 1.5 seconds
}

// Start broadcasting when server starts
startBroadcasting();

// Health check ping for all clients
const pingInterval = setInterval(() => {
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) {
      clients.delete(ws);
      return ws.terminate();
    }
    
    ws.isAlive = false;
    ws.ping();
  });
}, 30000); // Ping every 30 seconds

// Display server stats every 30 seconds
setInterval(() => {
  console.log(`📊 Server Status: ${clients.size} connected clients`);
  if (clients.size > 0) {
    console.log(`💰 Current Prices (sample):`);
    Object.entries(currentPrices).slice(0, 5).forEach(([symbol, price]) => {
      console.log(`   ${symbol}: $${price.toFixed(2)}`);
    });
  }
}, 30000);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down WebSocket server...');
  
  clearInterval(broadcastInterval);
  clearInterval(pingInterval);
  
  // Close all client connections
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.close(1000, 'Server shutting down');
    }
  });
  
  wss.close(() => {
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  
  clearInterval(broadcastInterval);
  clearInterval(pingInterval);
  
  wss.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});