#!/usr/bin/env node

(async () => {
  const command = process.argv[2]?.trim();

  if (command === 'mcp') {
    await import('./dist/mcp.js');
  } else {
    const { create } = await import('./dist/index.js');
    console.log(...create());
  }
})();
