// eslint-disable-next-line import/default
import CopyPlugin from 'copy-webpack-plugin';

import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import path from 'path';

const env = process.env.NODE_ENV;

const copyWebpackPlugin = env === 'development' ? new CopyPlugin({
  patterns: [
    {
      from: path.join(__dirname, 'src', 'renderer', 'assets'),
      to: 'assets/'
    }
  ]
}) : null;

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'postcss-loader' }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    copyWebpackPlugin
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src/')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  
};
