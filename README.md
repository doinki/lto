## Installation

### Using npm

```bash
npm install lto
```

### Using yarn

```bash
yarn add lto
```

### Using pnpm

```bash
pnpm install lto
```

## Usage

### Running the Command

To execute the package directly, use:

```bash
npx lto
# 1 4 11 14 25 43
```

### In Your JavaScript Code

You can also integrate lto into your JavaScript projects. Here's how you can use it:

```js
const { MAX_NUMBER, MIN_NUMBER, create, random } = require("lto");

console.log(MAX_NUMBER, MIN_NUMBER); // 45 1

console.log(random()); // 8

console.log(create()); // [ 2, 4, 10, 16, 19, 30 ]
```
