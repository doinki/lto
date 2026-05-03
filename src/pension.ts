import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { createPensionLotteryNumbers } from './index';

export function registerPensionTools(server: McpServer) {
  server.registerTool(
    'generate_pension_lottery_numbers',
    {
      description:
        'Generates 6 random digits for a Pension Lottery 720+(연금복권720+) ticket. The digits are integers ranging from 0 to 9, inclusive, and can be duplicates. Does not generate a group number. Returns a space-separated string of the 6 digits.',
    },
    () => ({
      content: [
        {
          text: `연금복권 번호: ${createPensionLotteryNumbers().join(' ')}`,
          type: 'text',
        },
      ],
    }),
  );
}
