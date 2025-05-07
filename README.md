# Ethereum Contract Transaction Notifier

A Node.js application that listens for real-time transactions (logs) to a specified Ethereum contract on the Sepolia testnet using [ethers.js](https://docs.ethers.io/) and Alchemy’s WebSocket API.

## Prerequisites

* **Node.js** (v14 or later) and **npm** installed
* An **Alchemy API key** for the Sepolia network
* A `.env` file in the project root with your API key

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/mattheworris/snowbridge-notifier.git
   cd snowbridge-notifier
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

## Configuration

This project uses `dotenv` to load environment variables from a `.env` file.

1. Create a `.env` file in the project root:

   ```dotenv
   ALCHEMY_API_KEY=your_alchemy_api_key_here
   ```

## Usage

1. **Run the notifier**:

   ```bash
   node notifier.mjs
   ```

2. The terminal will display a spinner and message count while listening. When a new transaction log is detected on the contract, the app prints a timestamped log:

   ```text
   🚀 Notifier started; spinning until logs land…
   🔗 WebSocket connected
   | [msgs: 10] {"jsonrpc":"2.0","method":"eth_subscription",…}
   ✅ [2025-05-07T18:42:15.123Z] New tx/log: { blockNumber: 1234567, data: "0x…", topics: […] }
   ```

## Customization

* **Contract address**: Edit the `CONTRACT` constant in `notifier.mjs` to listen to a different address.
* **Spinner interval**: Adjust the `setInterval` delay for status updates.

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your branch and open a Pull Request

## License

APACHE 2.0 © Matthew Orris

