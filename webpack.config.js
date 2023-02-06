const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  const isProd = !isDev;

  return {
    entry: `${src}/index.ts`,
    output: {
      filename: '[name].[contenthash].js',
      path: dist,
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(scss|css)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[local]_[hash:base64:8]',
                },
              },
            },
            'postcss-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/inline',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/inline',
        },
        {
          test: /\.tsx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: '3.6.5',
                  },
                ],
                'babel-preset-typescript-vue3',
                '@babel/preset-typescript',
              ],
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            hotReload: false,
          },
        },
      ],
    },
    devtool: isDev ? 'source-map' : false,
    plugins: [
      new HtmlWebpackPlugin({
        template: `${src}/index.html`,
        minify: isProd,
      }),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin(),
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(false),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      }),
      new Dotenv(),
    ],
    // optimization: {
    //   splitChunks: {
    //     chunks: 'all',
    //   },
    // },
    mode: argv.mode,
    resolve: {
      extensions: ['.ts', '...'],
      alias: {
        '@': src,
      },
    },
    // optimization: {
    //   minimize: false,
    // },
    externals: {
      vue: 'Vue',
    },
    devServer: {
      static: dist,
    },
  };
};
