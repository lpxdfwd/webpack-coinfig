'use strict';

const fs = require('fs');
const path = require('path');

const rootPath = fs.realpathSync(process.cwd());
const envDir = 'environment';
const suffix = '.env.js';
const NODE_ENV = process.env.NODE_ENV;

const defaultEnv = {
  NODE_ENV
};

let envConfig = null;

function loadEnv () {
  if (!envConfig) {
    const envFile = path.join(rootPath, envDir, NODE_ENV + suffix);
    const envObj = fs.existsSync(envFile) ? {...defaultEnv, ...require(envFile)} : {...defaultEnv};
    envConfig = getClientEnvironment(envObj);
  }
  return envConfig;
}

function getClientEnvironment (envObj) {
  const stringfyEnvs = Object.create(null);
  const keys = Object.keys(envObj);
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    stringfyEnvs[key] = JSON.stringify(envObj[key]);
  }

  return {
    raw: envObj,
    stringified: {
      'process.env': stringfyEnvs
    }
  }
}

module.exports = loadEnv;
