import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import z from 'zod';

import packageJson from '../package.json';
import { create } from './index';

const server = new McpServer({
  description:
    '로또 번호 생성 및 당첨 확인을 위한 MCP 서버입니다. 1부터 45까지의 숫자 중 무작위로 6개의 번호를 생성하거나, 입력한 번호의 최근 1년간 당첨 내역을 확인할 수 있습니다.',
  name: packageJson.name,
  version: packageJson.version,
});

server.registerTool(
  'generate_lotto_numbers',
  {
    description:
      '1부터 45까지의 숫자 중에서 무작위로 중복되지 않는 6개의 로또 번호를 생성합니다.',
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
      '입력한 로또 번호가 최근 1년간의 추첨 결과에서 당첨되었는지 확인합니다.',
      '',
      '입력 방법:',
      '- 1부터 45까지의 숫자 중 중복되지 않는 6개를 선택하여 입력하세요.',
      '',
      '당첨 등수 및 확률:',
      '- 1등: 6개 번호 모두 일치 (확률: 1/8,145,060)',
      '- 2등: 5개 번호 일치 + 보너스 번호 일치 (확률: 1/1,357,510)',
      '- 3등: 5개 번호 일치 (확률: 1/35,724)',
      '- 4등: 4개 번호 일치 (확률: 1/733)',
      '- 5등: 3개 번호 일치 (확률: 1/45)',
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
