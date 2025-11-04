import {RsdoctorRspackPlugin} from '@rsdoctor/rspack-plugin';
import {Compiler, rspack} from '@rspack/core';
import chalk from 'chalk';

import prodConfig from './rspack.prod.conf';

const {log} = console;

log(chalk.cyan('Building...'));

const isAnalyze: boolean = process.argv.includes('--analyze');

if (isAnalyze) {
  log(chalk.cyan('Enabling RsdoctorRspackPlugin'));
  prodConfig.plugins = [...(prodConfig.plugins || []), new RsdoctorRspackPlugin()];
}

const compiler: Compiler = rspack(prodConfig);

compiler.hooks.done.tap('done', () => {
  log(chalk.green('Build completed 🎉'));
});

compiler.run((err: Error | null) => {
  if (err) {
    log(chalk.red('Build failed:', err));
  }
});
