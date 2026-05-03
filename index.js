#!/usr/bin/env node

(async () => {
  const command = process.argv[2]?.trim();

  if (command === 'mcp') {
    await import('./dist/mcp.js');
  } else if (command === 'pension') {
    const { createPensionLotteryNumbers } = await import('./dist/index.js');
    console.log(...createPensionLotteryNumbers());
  } else {
    const { create } = await import('./dist/index.js');
    console.log(...create());
  }
})();
