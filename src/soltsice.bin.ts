#!/usr/bin/env node

// npm runnable script, set in "bin" section in package.json

import { soltsice } from './soltsice';
import * as cla from 'command-line-args';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const optionDefinitions: cla.OptionDefinition[] = [
  { name: 'paths', type: String, multiple: true, defaultOption: true },
  { name: 'cleanArtifacts', type: Boolean, defaultValue: false },
  { name: 'skipPattern', type: String, defaultValue: '' }
];

const options = cla(optionDefinitions) as soltsice.SoltsiceOptions;

soltsice.generateTypes(options);
