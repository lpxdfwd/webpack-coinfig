const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HappyPack = require('happypack');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const paths = require('./paths');
const {isBabelConfig, isProduction, getStyleLoaders} = require('./utils');
const getClientEnvironment = require('./env');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const env = getClientEnvironment();

const baseConfig = {
  mode: process.env.NODE_ENV,
  devtool: !isProduction && 'cheap-module-source-map',
  entry: [
    paths.poliffyIndexJs,
    paths.appIndexJs,
  ].concat(isProduction ? [] : require.resolve('react-dev-utils/webpackHotDevClient')).filter(Boolean),
  resolve: {
    extensions: paths.moduleFileExtensions
        .map(ext => `.${ext}`),
    plugins: [
      PnpWebpackPlugin,
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  resolveLoader: {
    plugins: [
      PnpWebpackPlugin.moduleLoader(module),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      env.raw.eslint && {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: require.resolve('react-dev-utils/eslintFormatter'),
              eslintPath: require.resolve('eslint'),
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            use: ['happypack/loader?id=babel'],
          },
          {
            test: /\.(js|mjs)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              presets: [
                [
                  require.resolve('babel-preset-react-app/dependencies'),
                  { helpers: true },
                ],
              ],
              cacheDirectory: true,
              cacheCompression: true,
              sourceMaps: false,
            },
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: ['happypack/loader?id=css'],
            sideEffects: true,
          },
          {
            test: cssModuleRegex,
            use: ['happypack/loader?id=cssModule']
          },
          {
            test: /\.less$/,
            use: ['happypack/loader?id=less'],
            sideEffects: true,
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ].filter(Boolean),
  },
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  }
}

const happypackList = [
  new HappyPack({
    id: 'babel',
    loaders: [
      {
        loader: 'babel-loader',
        options: {
          presets: !isBabelConfig ? [require.resolve('lpx-babel-presets/dist/presets')] : null,
          customize: require.resolve(
              'babel-preset-react-app/webpack-overrides'
          ),
          cacheDirectory: true,
          cacheCompression: true,
          compact: true,
          // babelrc: false,
          // extends: path.resolve(__dirname, '../babel.config.js')
        },
      }
    ]
  }),
  new HappyPack({
    id: 'cssModule',
    loaders: getStyleLoaders({
      importLoaders: 1,
      sourceMap: false,
      modules: true,
      getLocalIdent: getCSSModuleLocalIdent,
    })
  }),
  new HappyPack({
    id: 'less',
    loaders: getStyleLoaders(
        {
          importLoaders: 2,
        },
        'less-loader'
    )
  }),
  new HappyPack({
    id: 'css',
    loaders: getStyleLoaders({
      importLoaders: 1,
      sourceMap: false,
    })
  }),
]

module.exports = {
  baseConfig,
  happypackList
};
