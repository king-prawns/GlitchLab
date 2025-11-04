import {Compiler, DevServer, rspack} from '@rspack/core';
import {RspackDevServer} from '@rspack/dev-server';
import chalk from 'chalk';

import devConfig from './rspack.dev.conf';

const {log} = console;
const SERVER_PORT: string = '8800';

const compiler: Compiler = rspack(devConfig);

log(chalk.cyan('Starting dev server...'));

const options: DevServer = {
  client: {
    overlay: false
  },
  allowedHosts: 'all',
  port: SERVER_PORT,
  compress: true,
  server: {
    type: 'http'
  }
};

const server: RspackDevServer = new RspackDevServer(options, compiler!);
server
  .start()
  .then(() => {
    log(chalk.green(`Dev server is running: http://localhost:${SERVER_PORT}`));
  })
  .catch((err: unknown) => {
    log(chalk.red('Failed to start dev server:', err));
  });
