const path = require('path');
const {existsSync} = require('fs-extra');

const rootPath = process.cwd();

const getRootFilePath = filePath => path.resolve(rootPath, filePath);

const isBabelConfig = existsSync(getRootFilePath('babel.config.js')) || existsSync(getRootFilePath('.babelrc'));

module.exports = {
  isBabelConfig,
  getRootFilePath
};
