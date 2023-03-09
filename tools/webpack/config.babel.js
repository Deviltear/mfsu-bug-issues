import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import LoadablePlugin from '@loadable/webpack-plugin';
import ProgressPlugin from 'progress-webpack-plugin';
import * as fs from 'fs';
const { EsbuildPlugin } = require('esbuild-loader');

const version = process.env.RELEASE_VERSION || 'beta';

const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const { MFSU } = require('@umijs/mfsu');
const mfsu = new MFSU({
  implementor: webpack,
  buildDepWithESBuild: false,
});
const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv === 'development';

// Enable/disable css modules here
const USE_CSS_MODULES = true;
const localIdentName = isDev ? '[path][name]__[local]' : '[name]__[local]--[hash:base64:5]';
// Setup the plugins for development/production
const getPlugins = () => {
  // Common
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  const plugins = [
    new HtmlWebpackPlugin({
      title: 'demo',
      template: path.resolve(__dirname, '../../src/index.html'), // template file
      filename: path.resolve(__dirname, '../../dist/index.html'), // output file
    }),
    new WebpackManifestPlugin({
      fileName: path.resolve(__dirname, `../../dist/${version}/webpack-assets.json`),
      filter: (file) => file.isInitial,
    }),
    new LoadablePlugin({
      writeToDisk: true,
      filename: 'loadable-stats.json',
    }),
    // Setup enviorment variables for client
    new webpack.EnvironmentPlugin({ NODE_ENV: JSON.stringify(nodeEnv) }),
    // Setup global variables for client
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEV__: isDev,
      __CURRENT_LIFE_VERSION__: JSON.stringify(version), // 设置当前版本变量 以备后续提供 "提示用户刷新以获取新版本资源" 功能
    }),
  ];

  if (isDev) {
    // Development
    plugins.push(new webpack.HotModuleReplacementPlugin(), new FriendlyErrorsWebpackPlugin(), new ProgressPlugin(true));
  } else {
    plugins.push(
      // Production
      new MiniCssExtractPlugin({
        // Don't use hash in development, we need the persistent for "renderHtml.js"
        filename: isDev ? '[name].css' : '[name].[contenthash:8].css',
        chunkFilename: isDev ? '[id].css' : '[id].[contenthash:8].css',
      }),
      new webpack.ids.HashedModuleIdsPlugin(),
      new CompressionPlugin({
        test: /\.jsx?$|\.css$|\.(scss|sass|less)$|\.html$/,
        threshold: 10240,
      }),
      new ImageminPlugin({
        pngquant: { quality: '95-100' },
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: process.env.NODE_ENV === 'analyze' ? 'server' : 'disabled',
      }),
    );
  }

  return plugins;
};

// Setup the entry for development/production
const getEntry = () => {
  // Development

  let entry = './src/client.js';

  return entry;
};

// Webpack configuration
const config = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev && 'cheap-module-source-map',
  context: path.resolve(process.cwd()),
  entry: getEntry(),
  optimization: {
    minimizer: isDev
      ? []
      : [
          new EsbuildPlugin({
            target: 'es2015',
            css: true,
          }),
        ],
    splitChunks: {
      // Auto split vendor modules in production only
      chunks: isDev ? 'async' : 'all',
    },
  },
  output: {
    path: path.resolve(process.cwd(), isDev ? 'dist' : `dist/${version}`),
    publicPath: isDev ? '/' : `${process.env.BUILD_ASSETS_PUBLIC_PATH || ''}/${version}/`,
    // Don't use chunkhash in development it will increase compilation time
    filename: isDev ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDev ? '[id].js' : '[id].[chunkhash:8].js',
    pathinfo: isDev,
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
        exclude: [path.resolve(__dirname, '../../dist')],
      },
      {
        test: /\.(jsx?|tsx?)$/,
        // use: ['thread-loader', 'babel-loader?cacheDirectory'],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react','@babel/preset-flow','@babel/preset-typescript'],
            plugins: [...mfsu.getBabelPlugins()],
          },
        },
        exclude: [path.resolve(__dirname, '../../node_modules'), path.resolve(__dirname, '../../dist')],
      },
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'css',
              minify: true,
            },
          },
        ],
        exclude: [path.resolve(__dirname, '../../dist')],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: USE_CSS_MODULES && {
                localIdentName,
              },
              sourceMap: isDev,
            },
          },
          { loader: 'postcss-loader', options: { sourceMap: isDev } },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
        exclude: /node_modules/, // 不需要去转译"node\_modules"这里面的文件。
      },
      {
        test: /\.less$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
              modules: {
                auto: true,
                localIdentName,
              },
            },
          },
          { loader: 'postcss-loader', options: { sourceMap: isDev } },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: {
                  'primary-color': '#2B65F4',
                  'border-radius-base': '4px',
                  'progress-default-color': '#2B65F4',
                },
              },
            },
          },
        ],
        sideEffects: true,
      },
      {
        test: /\.(woff2?|ttf|eot|svg|woff)$/,
        loader: 'url-loader',
        type: 'asset/resource',
        dependency: { not: ['url'] },
        options: { limit: 10240, name: isDev ? '[name].[ext]' : '[name].[hash:8].[ext]' },
        exclude: /node_modules/, // 不需要去转译"node\_modules"这里面的文件。
        include: path.resolve(__dirname, '../../public'),
      },
      {
        test: /\.(gif|png|jpe?g|webp)$/,
        // Any image below or equal to 10K will be converted to inline base64 instead
        loader: 'url-loader',
        dependency: { not: ['url'] },
        options: { limit: 10240, name: isDev ? '[name].[ext]' : '[name].[hash:8].[ext]' },
        exclude: /node_modules/, // 不需要去转译"node\_modules"这里面的文件。
      },
    ],
  },
  plugins: getPlugins(),
  resolve: {
    modules: [path.resolve(__dirname, '../../src/'), 'node_modules'],
    descriptionFiles: ['package.json'],
    extensions: ['.js', '.tsx', '.ts', '.jsx', '.json'],
    fallback: {
      fs: false,
      tls: false,
      net: false,
      node: false,
      path: false,
      assert: false,
      querystring: require.resolve('querystring-es3'),
    },
    alias: {
      '@': path.resolve(__dirname, '../../src'),
    },
  },

  node: {
    global: true,
  },
  devServer: {
    setupMiddlewares(middlewares) {
      middlewares.unshift(...mfsu.getMiddlewares());
      return middlewares;
    },
    historyApiFallback: true,
    compress: false,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    hot: true,
    proxy: fs.existsSync(path.join(__dirname, '../../proxy.local.json')) ? require('../../proxy.local.json') : require('../../proxy.json'),
    port: process.env.PORT || 8000,
  },
  cache: {
    type: isDev ? 'memory' : 'filesystem',
  },
};

const depConfig = {
  output: {},
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react','@babel/preset-flow','@babel/preset-typescript'],
          },
        },
      },
    ],
  },
  plugins: [],
};
const getConfig = async () => {
  await mfsu.setWebpackConfig({ config, depConfig });
  return config;
};
module.exports = getConfig();
// module.exports = config;

