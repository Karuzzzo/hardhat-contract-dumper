# Contract memory dumper

Project lists all non-zero storage values for first 100 slots, tries to decode them. 

## Installation:

```bash
yarn add --dev hardhat-contract-dumper
```

## Usage:

Load plugin in Hardhat config:

```javascript
require('hardhat-contract-dumper');
```

Run the included Hardhat task and supply contract address:


```bash
npx hardhat contract-dump-memory --address <0xB8c77482e45F1F44dE1745F52C74426C631bDD52>
```
