const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssNormalize = require('postcss-normalize');
const path = require('path');
const {existsSync} = require('fs-extra');

const rootPath = process.cwd();

const getRootFilePath = filePath => path.resolve(rootPath, filePath);

const isBabelConfig = existsSync(getRootFilePath('babel.config.js')) || existsSync(getRootFilePath('.babelrc'));

const isProduction = process.env.NODE_ENV === 'production';

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isProduction ? {
      loader: MiniCssExtractPlugin.loader,
    } : require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
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
        sourceMap: false,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: false,
        javascriptEnabled: isProduction,
      },
    });
  }
  return loaders;
};

module.exports = {
  isBabelConfig,
  getRootFilePath,
  isProduction,
  getStyleLoaders,
};
