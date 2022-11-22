#!/usr/bin/env node

require('esbuild')
    .serve({
        servedir: 'www/index.html'
    }).catch(() => process.exit(1));