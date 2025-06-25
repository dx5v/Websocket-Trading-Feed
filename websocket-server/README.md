# Trade Feed WebSocket Server

A production-ready WebSocket server for broadcasting live cryptocurrency trade data. Designed for deployment on Render.com with automatic scaling and health monitoring.

## Features

- **Real-time Trade Broadcasting**: Generates and broadcasts realistic trade data every 1.5 seconds
- **Multiple Symbols**: 10 popular cryptocurrency pairs with realistic price movements
- **Multiple Exchanges**: 6 major exchanges (Binance, Coinbase, Kraken, etc.)
- **Production Ready**: Built for cloud deployment with proper error handling
- **Health Monitoring**: Automatic client health checks and connection management
- **Scalable**: Handles multiple concurrent connections efficiently

## Trade Data Format

Each broadcast message follows this format:

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

## Local Development

1. **Install dependencies**:
   ```bash
   cd websocket-server
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Connect to the server**:
   - Local URL: `ws://localhost:8080`
   - The server will start broadcasting trade data immediately

## Deployment on Render.com

### Step 1: Prepare for Deployment

1. **Create a Git repository** with this `websocket-server` folder
2. **Push to GitHub/GitLab** (Render connects to Git repositories)

### Step 2: Deploy on Render

1. **Go to [Render.com](https://render.com)** and sign up/login
2. **Click "New +"** → **"Web Service"**
3. **Connect your repository** containing the websocket-server folder
4. **Configure the service**:
   - **Name**: `trade-feed-websocket-server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (or paid for better performance)

### Step 3: Environment Configuration

Render will automatically:
- Set the `PORT` environment variable
- Provide HTTPS/WSS support
- Handle scaling and health checks

### Step 4: Access Your Deployed Server

After deployment, you'll get a URL like:
```
wss://trade-feed-websocket-server.onrender.com
```

## Connection URLs

- **Local Development**: `ws://localhost:8080`
- **Render Deployment**: `wss://your-app-name.onrender.com`

## Server Features

### Automatic Trade Generation
- **10 Cryptocurrency Symbols**: BTC/USD, ETH/USD, SOL/USD, ADA/USD, DOT/USD, LINK/USD, MATIC/USD, UNI/USD, AVAX/USD, ATOM/USD
- **Realistic Price Movements**: Each symbol has different volatility patterns
- **Variable Trade Sizes**: Different size ranges per symbol type
- **Random Timing**: Broadcasts every 1.5 seconds

### Connection Management
- **Health Checks**: Automatic ping/pong to detect disconnected clients
- **Graceful Shutdown**: Proper cleanup on server restart
- **Error Handling**: Robust error handling for production use
- **Client Tracking**: Real-time client count monitoring

### Monitoring
- **Connection Logs**: Track client connections and disconnections
- **Trade Broadcast Logs**: Monitor all trade broadcasts
- **Performance Stats**: Regular status updates every 30 seconds
- **Price Tracking**: Display current price samples

## Production Considerations

### Performance
- **Optimized Broadcasting**: Only broadcasts when clients are connected
- **Efficient Memory Usage**: Automatic cleanup of disconnected clients
- **Connection Limits**: Handles multiple concurrent connections

### Reliability
- **Error Recovery**: Automatic recovery from connection errors
- **Health Monitoring**: Built-in health checks for client connections
- **Graceful Degradation**: Continues operating even if some clients disconnect

### Security
- **CORS Friendly**: Works with web applications from different domains
- **Connection Validation**: Proper WebSocket connection handling
- **Resource Limits**: Prevents resource exhaustion

## Render.com Specific Features

- **Automatic HTTPS/WSS**: Render provides SSL certificates automatically
- **Health Checks**: Built-in health monitoring
- **Auto-scaling**: Automatic scaling based on demand
- **Zero Downtime Deploys**: Seamless updates without service interruption
- **Global CDN**: Fast connections worldwide

## Testing the Deployment

1. **Deploy the server** following the steps above
2. **Get your WebSocket URL** from Render dashboard
3. **Connect your trade feed application** using the WSS URL
4. **Monitor the Render logs** to see connection and broadcast activity

## Troubleshooting

### Common Issues
- **Connection Failed**: Ensure you're using `wss://` for deployed server
- **No Data**: Check Render logs for server errors
- **Slow Performance**: Consider upgrading to a paid Render plan

### Render Logs
Check the Render dashboard logs for:
- Server startup messages
- Client connection logs
- Trade broadcast activity
- Any error messages

## Cost Considerations

- **Render Free Tier**: 750 hours/month (sufficient for testing)
- **Paid Plans**: Start at $7/month for better performance and always-on service
- **Auto-sleep**: Free tier services sleep after 15 minutes of inactivity

## License

MIT License - Free to use and modify.