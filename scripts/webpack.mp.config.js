const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MpPlugin = require('mp-webpack-plugin')
const postcssNormalize = require('postcss-normalize')
const isOptimize = false // 是否压缩业务代码，开发者工具可能无法完美支持业务代码使用到的 es 特性，建议自己做代码压缩

module.exports = {
  mode: 'production',
  entry: {
    index: path.resolve(__dirname, '../src/index.js'),
    index1: path.resolve(__dirname, '../src/pages/index1/index.js'),
    log: path.resolve(__dirname, '../src/log.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dest/mp/common'), // 放到小程序代码目录中的 common 目录下
    filename: '[name].js', // 必需字段，不能修改
    library: 'createApp', // 必需字段，不能修改
    libraryExport: 'default', // 必需字段，不能修改
    libraryTarget: 'window', // 必需字段，不能修改
  },
  target: 'web', // 必需字段，不能修改
  optimization: {
    runtimeChunk: false, // 必需字段，不能修改
    splitChunks: {
      // 代码分隔配置，不建议修改
      chunks: 'all',
      minSize: 1000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 100,
      maxInitialRequests: 100,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },

    minimizer: isOptimize
      ? [
          // 压缩CSS
          new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.(css|wxss)$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
              preset: [
                'default',
                {
                  discardComments: {
                    removeAll: true,
                  },
                  minifySelectors: false, // 因为 wxss 编译器不支持 .some>:first-child 这样格式的代码，所以暂时禁掉这个
                },
              ],
            },
            canPrint: false,
          }),
          // 压缩 js
          new TerserPlugin({
            test: /\.js(\?.*)?$/i,
            parallel: true,
          }),
        ]
      : [],
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        include: /src/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
              modules: {
                namedExport: true,
              },
            },
          },
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 2,
              esModule: true,
              modules: {
                namedExport: true,
              },
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                }),
                postcssNormalize(),
              ],
            },
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
        sideEffects: true,
      },
      {
        test: /\.(less|css)$/,
        include: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              //   modifyVars,
            },
          },
        ],
        sideEffects: true,
      },
      {
        test: /\.[t|j]sx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            [
              require('@babel/preset-env'),
              {
                useBuiltIns: 'entry',
                corejs: 3,
                exclude: ['transform-typeof-symbol'],
              },
            ],
            [
              require('@babel/preset-react').default,
              {
                development: false,
                useBuiltIns: true,
                runtime: 'automatic',
              },
            ],
          ].filter(Boolean),
          assumptions: {
            setPublicClassFields: true,
          },
          plugins: [
            ['@babel/plugin-syntax-jsx'],
            ['@babel/plugin-transform-react-jsx'],
            ['@babel/plugin-transform-react-display-name'],
            ['add-module-exports'],
            [
              require('@babel/plugin-transform-flow-strip-types').default,
              false,
            ],
            require('babel-plugin-macros'),
            // 'transform-decorators-legacy',
            // 'transform-class-properties',
            // ['@babel/plugin-proposal-decorators', { legacy: true }],
            // ['@babel/plugin-proposal-class-properties', { loose: true }],

            // ['transform-react-jsx'],
            // ['class'],
          ],
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    alias: {
      '@/assets': path.resolve(__dirname, '../public/assets/'),
      '@/src': path.resolve(__dirname, '../src/'),
      '@/zero': path.resolve(__dirname, '../src/zero/'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.isMiniprogram': process.env.isMiniprogram, // 注入环境变量，用于业务代码判断
    }),
    new MiniCssExtractPlugin({
      filename: '[name].wxss',
    }),
    new MpPlugin(require('./miniprogram.config')),
  ],
}
