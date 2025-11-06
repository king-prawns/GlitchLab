import path from 'path';

import {Configuration, DefinePlugin, SwcJsMinimizerRspackPlugin} from '@rspack/core';

import {version} from '../../package.json';

const prodConfig: Configuration = {
  extends: './rspack.base.conf.ts',
  entry: './src/index.ts',
  mode: 'production',
  resolve: {
    tsConfig: {
      configFile: path.resolve(__dirname, '../typescript/tsconfig.prod.json')
    },
    extensions: ['.ts']
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, '../../dist'),
    filename: 'glitchlab.js',
    libraryTarget: 'commonjs'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new SwcJsMinimizerRspackPlugin({
        minimizerOptions: {
          module: true,
          minify: true,
          format: {
            comments: false
          },
          compress: {
            passes: 0
          }
        }
      })
    ]
  },
  plugins: [
    new DefinePlugin({
      APP_VERSION: JSON.stringify(version)
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: [/[\\/]node_modules[\\/]/],
        include: [path.resolve(__dirname, '../../src')],
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            loose: false,
            target: 'es5'
          }
        }
      }
    ]
  }
};

export default prodConfig;
