import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import packageJson from '../package.json';
import { registerLottoTools } from './lotto.js';
import { registerPensionTools } from './pension.js';

const server = new McpServer({
  description:
    'This MCP server provides tools for generating and checking lottery numbers. It supports Lotto 6/45(로또6/45) for number generation and win checking, and Pension Lottery 720+(연금복권720+) for number generation.',
  name: packageJson.name,
  version: packageJson.version,
});

registerLottoTools(server);
registerPensionTools(server);

async function main() {
  const transport = new StdioServerTransport();

  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

let isShuttingDown = false;

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;

    server
      .close()
      .then(() => {
        process.exit(0);
      })
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  });
});
