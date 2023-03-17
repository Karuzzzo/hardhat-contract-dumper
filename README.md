# 📦 Ethereum Storage Dumper

Ethereum Storage Dumper is a simple command-line tool 🛠️ that utilizes the Hardhat framework to inspect and decode the storage values of a given Ethereum contract. It allows users to quickly and easily understand the values stored in a contract's storage slots. 💾

## ✨ Features

- Inspect storage values from slot 0 to a specified limit 🔍
- Decode storage values, including addresses, numbers, and strings 📚
- Optional tracing mode to log each checked storage slot 🔬
- Built using the Hardhat framework 🏗️

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (>= 12.0.0)
- [Hardhat](https://hardhat.org/) (>= 2.0.0)

## 🚀 Installation

1. Install the `ethereum-storage-dumper` plugin in your Hardhat project:
```
npm install --save-dev ethereum-storage-dumper
```
2. Require the plugin in your `hardhat.config.js`:

```javascript
require("ethereum-storage-dumper");
```

or, for `hardhat.config.ts`:

```typescript
import "ethereum-storage-dumper";
```

## 🛠️ Usage

To dump the storage values of a contract, use the following command:

```

npx hardhat sd --address CONTRACT_ADDRESS [--to SLOT_LIMIT, --raw]
```

- `CONTRACT_ADDRESS`: The Ethereum address of the contract you want to inspect. 📝
- `SLOT_LIMIT`: The maximum storage slot to check (default: 100, and you dont need to go deeper). 🔢
- `--raw`: (Optional) Print all storage slots as-is in hex 📈

## 📖 Example

To dump storage values of a contract with the address `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` and a slot limit of 100, run:

```
npx hardhat sd --address 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
```

To enable raw mode, add the `--raw` flag:

```
npx hardhat sd --address 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 --raw
```

## 📄 License

This project is released under the [MIT License](LICENSE).

Man, I love GPT4 generating, upgrading and fixing my stuff )