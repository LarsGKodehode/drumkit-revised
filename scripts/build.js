#!/usr/bin/env node

require('esbuild')
  .build({
    logLevel: "info",
    entryPoints: ['src/main.js'],
    bundle: true,
    outdir: 'build',
    minify: true,
    sourcemap: true,
    loader: {
      ".html": "text",
    },
  }).catch(() => process.exit(1))