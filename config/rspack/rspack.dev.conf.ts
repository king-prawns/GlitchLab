import path from 'path';

import {Configuration, HtmlRspackPlugin} from '@rspack/core';

const devConfig: Configuration = {
  extends: './rspack.base.conf.ts',
  mode: 'development',
  resolve: {
    tsConfig: {
      configFile: path.resolve(__dirname, '../typescript/tsconfig.json')
    },
    extensions: ['.ts', '.tsx', '.js', '.json', '.css']
  },
  optimization: {
    minimize: false
  },
  devtool: 'cheap-module-source-map',
  experiments: {
    css: false
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, '../../sandbox/dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  entry: {
    main: path.resolve(__dirname, '../../sandbox/src/index.tsx')
  },
  plugins: [
    new HtmlRspackPlugin({
      title: 'Sandbox',
      filename: 'index.html',
      favicon: 'sandbox/favicon.ico',
      template: 'sandbox/page-template.html',
      chunks: ['main']
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        include: [path.resolve(__dirname, '../../src'), path.resolve(__dirname, '../../sandbox')],
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            loose: false,
            target: 'es5'
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  }
};

export default devConfig;
