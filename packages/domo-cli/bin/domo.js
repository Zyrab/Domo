#!/usr/bin/env node
import { Command } from 'commander';
import { runNew } from '../commands/new.js';
import { runGenerate } from '../commands/generate.js';
import { runBuild } from '../commands/build.js';
import { runServe } from '../commands/serve.js';

const program = new Command();

program
  .name('domo')
  .description('CLI for Domo ecosystem')
  .version('1.0.0');

program
  .command('new <projectName>')
  .description('Create a new Domo project')
  .action((name) => runNew(name));

program
  .command('generate <type> <name>')
  .alias('g')
  .description('Generate a new file from template (e.g., page, component)')
  .action((type, name) => runGenerate(type, name));

program
  .command('build')
  .description('Build your Domo project')
  .action(() => runBuild());

program
  .command('serve')
  .description('Serve your Domo project locally')
  .option('-p, --port <number>', 'Port to run on', '3000')
  .action((opts) => runServe(opts));

program.parse(process.argv);
