#!/usr/bin/env node

// npm runnable script, set in "bin" section in package.json

import { soltsice } from './soltsice';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

soltsice.generateTypes(soltsice.parseArgs(process.argv.slice(2)));
