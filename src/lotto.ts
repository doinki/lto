import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { create } from './index.js';

export function registerLottoTools(server: McpServer) {
  server.registerTool(
    'generate_lotto_numbers',
    {
      description:
        'Generates 6 unique random numbers for a Lotto 6/45(로또6/45) ticket. The numbers are integers ranging from 1 to 45, inclusive. Returns a space-separated string of the sorted numbers.',
    },
    () => {
      return {
        content: [
          {
            text: '로또 번호: ' + create().join(' '),
            type: 'text',
          },
        ],
      };
    },
  );

  server.registerTool(
    'check_lotto_numbers',
    {
      description: [
        'Checks the winning status of a user-provided Lotto 6/45(로또6/45) ticket against the last year of draw results.',
        'Input: An array of 6 unique integers from 1 to 45.',
        'Output: A summary of any wins, including draw number, winning numbers, and rank. If no wins, it returns a "no wins" message.',
        'Prize Tiers:',
        '- 1st: 6 numbers match',
        '- 2nd: 5 numbers match + bonus number',
        '- 3rd: 5 numbers match',
        '- 4th: 4 numbers match',
        '- 5th: 3 numbers match',
      ].join('\n'),
      inputSchema: z.object({
        numbers: z
          .array(z.number().int().min(1).max(45))
          .length(6)
          .refine((numbers) => new Set(numbers).size === numbers.length, {
            error: '로또 번호는 중복될 수 없습니다.',
          }),
      }),
    },
    async ({ numbers }) => {
      numbers.sort((a, b) => a - b);

      const url = new URL(
        'https://dhlottery.co.kr/lt645/checkWnNoList.do?recordCountPerPage=100',
      );
      url.searchParams.set('myNoList', numbers.join(','));

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          [
            'Failed to fetch:',
            [response.status, response.statusText].filter(Boolean).join(' '),
          ].join(' '),
        );
      }

      const data = (await response.json()) as {
        data: {
          list: Array<{
            bnsWnNo: string;
            correctCnt: string;
            /**
             * 회차
             */
            ltEpsd: string;
            /**
             * @example '2025-12-27 20:30:00.0'
             */
            ltRflYmd: string;
            /**
             * 등수
             * @example '1'
             * @example 'X'
             */
            rank: string;
            tm1WnNo: string;
            tm1WnNoFlag?: 'Y';
            tm2WnNo: string;
            tm2WnNoFlag?: 'Y';
            tm3WnNo: string;
            tm3WnNoFlag?: 'Y';
            tm4WnNo: string;
            tm4WnNoFlag?: 'Y';
            tm5WnNo: string;
            tm5WnNoFlag?: 'Y';
            tm6WnNo: string;
            tm6WnNoFlag?: 'Y';
          }>;
        };
      };

      const filtered = data.data.list.filter((item) => item.rank !== 'X');

      if (filtered.length === 0) {
        return {
          content: [
            {
              text: [
                '*최근 1년간 당첨 기록이 없습니다.*',
                '[최근 추첨 결과 보기](https://dhlottery.co.kr/lt645/result)',
              ].join('\n'),
              type: 'text',
            },
          ],
        };
      }

      return {
        content: [
          {
            text:
              '# 최근 1년 당첨 내역\n' +
              filtered
                .map((item) =>
                  [
                    `## ${item.ltEpsd}회차 (${item.ltRflYmd.split(' ')[0]})`,
                    `- 당첨 번호: ${item.tm1WnNo}, ${item.tm2WnNo}, ${item.tm3WnNo}, ${item.tm4WnNo}, ${item.tm5WnNo}, ${item.tm6WnNo}`,
                    `- 일치한 번호 개수: ${item.correctCnt}개`,
                    `- 당첨 등수: ${item.rank}등`,
                  ].join('\n'),
                )
                .join('\n\n'),
            type: 'text',
          },
        ],
      };
    },
  );
}
