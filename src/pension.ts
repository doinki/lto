import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { random } from './index.js';

type PensionLotteryNumbers = [number, number, number, number, number, number];

function createPensionLotteryNumbers(): PensionLotteryNumbers {
  const numbers: number[] = [];
  for (let i = 0; i < 6; i++) {
    numbers.push(random(0, 9));
  }
  return numbers as PensionLotteryNumbers;
}

export function registerPensionTools(server: McpServer) {
  server.registerTool(
    'generate_pension_lottery_numbers',
    {
      description:
        'Generates 6 random digits for a Pension Lottery 720+(연금복권720+) ticket. The digits are integers ranging from 0 to 9, inclusive, and can be duplicates. Does not generate a group number. Returns a space-separated string of the 6 digits.',
    },
    () => {
      return {
        content: [
          {
            text: `연금복권 번호: ${createPensionLotteryNumbers().join(' ')}`,
            type: 'text',
          },
        ],
      };
    },
  );
}
