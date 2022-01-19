const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');
const path = require('path');
const packageInfo = require('./package.json');

const productionMode = process.env.NODE_ENV === 'production';

// Generate pages object
const pages = {};

const chromeName = ['background', 'options'];

chromeName.forEach(name => {
  pages[name] = {
    entry: `src/${name}/index.js`,
    template: path.resolve(`src/${name}/index.html`),
    filename: `${name}.html`,
    chunks: ['chunk-vendors', 'chunk-common', name],
  };
});

const folderName = productionMode ? 'build' : 'dist';
const copyFiles = [
  {
    from: path.resolve(`src/manifest.${productionMode ? 'production' : 'development'}.json`),
    to: `${path.resolve(folderName)}/manifest.json`,
  },
];

copyFiles.push({
  from: path.resolve('src/assets'),
  to: path.resolve(folderName),
});

process.env.VUE_APP_VERSION = productionMode ? packageInfo.version : packageInfo.version + ' (Dev)';

module.exports = {
  outputDir: folderName,
  pages,
  filenameHashing: false,
  productionSourceMap: false,
  lintOnSave: 'warning',
  configureWebpack: config => {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: copyFiles,
      })
    );

    if (productionMode) {
      Object.assign(config.optimization.minimizer[0].options.terserOptions.compress, {
        warnings: false,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
      });

      config.plugins.push(
        new ZipWebpackPlugin({
          path: path.resolve('archive'),
          filename: `${packageInfo.name}_v${packageInfo.version}.zip`,
        })
      );
    }

    // 关闭 webpack 的性能提示
    config.performance = {
      hints: false,
    };
  },
};
