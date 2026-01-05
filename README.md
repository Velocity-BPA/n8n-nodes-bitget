# n8n-nodes-bitget

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Bitget cryptocurrency exchange, providing full API v2 support for spot trading, futures trading, copy trading, market data, and earn products.

![n8n](https://img.shields.io/badge/n8n-community--node-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)

## Features

- **Spot Trading**: Place orders, manage positions, view balances, and access trade history
- **Futures Trading**: USDT-M, USDC-M, and Coin-M perpetual contracts with leverage up to 125x
- **Copy Trading**: Follow elite traders, manage copy settings, and close copied positions
- **Market Data**: Real-time tickers, order books, candlesticks, and recent trades
- **Earn Products**: Flexible and fixed savings products subscription and redemption
- **Polling Triggers**: Price alerts, order fills, position changes, and balance updates
- **Demo Trading**: Full support for paper trading environment

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-bitget`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-bitget

# Restart n8n
```

### Development Installation

```bash
# Clone or extract the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-bitget.git
cd n8n-nodes-bitget

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-bitget

# Restart n8n
n8n start
```

## Credentials Setup

### Creating API Keys

1. Log in to your [Bitget account](https://www.bitget.com)
2. Navigate to **API Management**
3. Click **Create API Key**
4. Set permissions based on your needs:
   - **Read**: Market data, balances, order history
   - **Trade**: Place and cancel orders
   - **Transfer**: Move funds between accounts
5. Set IP whitelist (recommended for production)
6. Save your API Key, Secret Key, and Passphrase

### Configuring in n8n

| Field | Description |
|-------|-------------|
| API Key | Your Bitget API key |
| Secret Key | Your Bitget API secret |
| Passphrase | The passphrase you set when creating the API key |
| Environment | `production` for real trading, `demo` for paper trading |

## Resources & Operations

### Spot Account
| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve spot account balances |
| Get Bills | View transaction history |
| Transfer | Transfer funds between accounts |
| Get Transfer History | View transfer records |

### Spot Trading
| Operation | Description |
|-----------|-------------|
| Place Order | Submit market or limit orders |
| Batch Place Orders | Submit up to 50 orders at once |
| Cancel Order | Cancel a specific order |
| Batch Cancel Orders | Cancel multiple orders |
| Get Open Orders | View current open orders |
| Get Order History | View historical orders |
| Get Order Detail | Get details of a specific order |
| Get Fills | View trade executions |

### Futures Account
| Operation | Description |
|-----------|-------------|
| Get Account | Retrieve futures account info |
| Get Positions | View all open positions |
| Get Single Position | Get specific position details |
| Set Leverage | Adjust leverage (1-125x) |
| Set Margin Mode | Switch between cross/isolated margin |
| Get Bills | View futures transaction history |

### Futures Trading
| Operation | Description |
|-----------|-------------|
| Place Order | Open/close futures positions |
| Batch Place Orders | Submit multiple orders |
| Modify Order | Update existing order |
| Cancel Order | Cancel specific order |
| Cancel All Orders | Cancel all orders for a symbol |
| Get Open Orders | View current orders |
| Get Order History | View historical orders |
| Get Fills | View trade executions |
| Place Plan Order | Create trigger/stop orders |
| Cancel Plan Order | Cancel trigger orders |
| Get Plan Orders | View pending trigger orders |

### Copy Trading
| Operation | Description |
|-----------|-------------|
| Get Traders | List elite traders to follow |
| Get Trader Positions | View a trader's positions |
| Follow Trader | Start copying a trader |
| Unfollow Trader | Stop copying |
| Get Follow Settings | View copy settings |
| Update Follow Settings | Modify copy ratio/amount |
| Get Follower History | View copy trade history |
| Close Follower Position | Close a copied position |

### Market Data
| Operation | Description |
|-----------|-------------|
| Get Tickers | All market tickers |
| Get Ticker | Single symbol ticker |
| Get Order Book | Market depth data |
| Get Candles | OHLCV candlestick data |
| Get Trades | Recent market trades |
| Get Symbols | Trading pairs info |
| Get Server Time | Exchange server time |

### Earn Products
| Operation | Description |
|-----------|-------------|
| Get Products | List available earn products |
| Subscribe | Subscribe to a product |
| Redeem | Redeem from a product |
| Get Subscriptions | View active subscriptions |
| Get History | View subscription history |

## Trigger Node

The Bitget Trigger node provides polling-based triggers for various events:

| Event | Description | Requires Auth |
|-------|-------------|---------------|
| Price Alert | Trigger when price crosses threshold | No |
| Order Filled | Trigger when orders are executed | Yes |
| Position Change | Trigger when futures positions change | Yes |
| Balance Change | Trigger when account balance changes | Yes |
| New Trade | Trigger on new market trades | No |

## Usage Examples

### Place a Spot Market Order

```json
{
  "resource": "spotTrading",
  "operation": "placeOrder",
  "symbol": "BTCUSDT",
  "side": "buy",
  "orderType": "market",
  "size": "0.001"
}
```

### Open a Long Futures Position

```json
{
  "resource": "futuresTrading",
  "operation": "placeOrder",
  "productType": "USDT-FUTURES",
  "symbol": "BTCUSDT",
  "side": "open_long",
  "orderType": "limit",
  "price": "40000",
  "size": "0.01",
  "marginCoin": "USDT"
}
```

### Follow a Trader

```json
{
  "resource": "copyTrading",
  "operation": "followTrader",
  "traderId": "123456789",
  "productType": "USDT-FUTURES",
  "copyMode": "fixedAmount",
  "fixedAmount": "100",
  "maxFollowAmount": "1000"
}
```

### Get OHLCV Candlesticks

```json
{
  "resource": "marketData",
  "operation": "getCandles",
  "marketType": "spot",
  "symbol": "BTCUSDT",
  "granularity": "1H",
  "limit": 100
}
```

## Bitget API Concepts

### Product Types (Futures)
- **USDT-FUTURES**: USDT-margined perpetual contracts
- **USDC-FUTURES**: USDC-margined perpetual contracts
- **COIN-FUTURES**: Coin-margined (inverse) perpetual contracts

### Order Types
- **limit**: Specify exact price
- **market**: Execute at best available price

### Time in Force
- **GTC** (Good Till Cancel): Order remains until filled or canceled
- **IOC** (Immediate or Cancel): Fill immediately or cancel remaining
- **FOK** (Fill or Kill): Fill entirely or cancel completely
- **post_only**: Only add liquidity, never take

### Margin Modes
- **crossed**: Share margin across all positions
- **isolated**: Dedicate margin to specific position

## Error Handling

The node handles common Bitget API errors:

| Code | Description |
|------|-------------|
| 00000 | Success |
| 40001 | Invalid API key |
| 40002 | Invalid signature |
| 40003 | Invalid timestamp |
| 40004 | API key expired |
| 40005 | Permission denied |
| 40006 | Rate limit exceeded |
| 40007 | IP not whitelisted |
| 43001 | Insufficient balance |
| 43002 | Order not found |
| 43003 | Order already cancelled |
| 45001 | Position not found |
| 45002 | Leverage exceeds limit |

Rate limit errors automatically retry with exponential backoff.

## Security Best Practices

1. **Use IP Whitelisting**: Restrict API access to known IPs
2. **Minimal Permissions**: Only enable required permissions
3. **Demo Environment**: Test workflows in paper trading first
4. **Secure Credentials**: Never expose API keys in workflows
5. **Regular Rotation**: Periodically rotate API keys

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Format code
npm run format
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-bitget/issues)
- **Licensing**: licensing@velobpa.com
- **General**: support@velobpa.com

## Acknowledgments

- [n8n](https://n8n.io) - Workflow automation platform
- [Bitget](https://www.bitget.com) - Cryptocurrency exchange
- [Velocity BPA](https://velobpa.com) - Business process automation
