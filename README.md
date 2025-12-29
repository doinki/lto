## Installation

Install lto using your preferred package manager:

```bash
# npm
npm install lto

# yarn
yarn add lto

# pnpm
pnpm install lto
```

## Usage

### Command Line

Generate lotto numbers directly from the command line:

```bash
npx lto
# Output: 1 4 11 14 25 43
```

### JavaScript/TypeScript

Import and use lto in your JavaScript or TypeScript projects:

```js
const { MAX_NUMBER, MIN_NUMBER, create, random } = require('lto');

// Constants
console.log(MAX_NUMBER, MIN_NUMBER); // 45 1

// Generate a single random number between 1 and 45
console.log(random()); // 8

// Generate 6 unique lotto numbers (sorted)
console.log(create()); // [ 2, 4, 10, 16, 19, 30 ]
```

**Available exports:**

- `MAX_NUMBER`: Maximum lotto number (45)
- `MIN_NUMBER`: Minimum lotto number (1)
- `create()`: Returns an array of 6 unique, sorted numbers from 1 to 45
- `random()`: Returns a single random number between 1 and 45

### MCP Server (Model Context Protocol)

lto can be used as an MCP server, allowing AI assistants and other MCP-compatible tools to generate and check lotto numbers.

#### Setup

Add the following configuration to your MCP client settings file (e.g., `~/.cursor/mcp.json` or `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "lto": {
      "command": "npx",
      "args": ["-y", "lto", "mcp"]
    }
  }
}
```

#### Available Tools

**`generate_lotto_numbers`**

Generates 6 random, non-duplicate lotto numbers from 1 to 45.

- **Returns**: A space-separated string of 6 sorted numbers
- **Example**: `"2 9 10 27 37 44"`

**`check_lotto_numbers`**

Checks if your lotto numbers have won any prizes in the past year's draw results.

- **Parameters**:
  - `numbers` (required): An array of 6 non-duplicate numbers from 1 to 45
- **Returns**: Prize information if won, or a message indicating no wins
- **Prize tiers**:
  - **1st place**: All 6 numbers match (probability: 1/8,145,060)
  - **2nd place**: 5 numbers match + bonus number matches (probability: 1/1,357,510)
  - **3rd place**: 5 numbers match (probability: 1/35,724)
  - **4th place**: 4 numbers match (probability: 1/733)
  - **5th place**: 3 numbers match (probability: 1/45)
