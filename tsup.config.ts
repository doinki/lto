import { defineConfig } from 'tsup';

export default defineConfig([
  {
    bundle: true,
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    env: { NODE_ENV: 'production' },
    esbuildOptions: (options) => {
      options.sourcemap = true;
    },
    format: ['cjs', 'esm'],
    target: 'node16',
    treeshake: true,
  },
  {
    bundle: true,
    clean: true,
    entry: ['src/mcp.ts'],
    env: { NODE_ENV: 'production' },
    format: 'esm',
    target: 'node20',
    treeshake: true,
  },
]);
