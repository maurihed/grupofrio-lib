const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const AssetsPlugin = require('assets-webpack-plugin');

const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);
const presetConfig = require("./build-utils/loadPresets");
const vueConfig = require("./vue.config");
const buildDefinePlugin = require('./build-utils/buildDefines');

module.exports = ({ mode, presets, base } = { mode: 'production', presets: [], base: 'index' }) => {
  return webpackMerge(
    {
      mode,
      entry: {
        main: [
          './src/index.js',
          './src/main.scss'
        ]
      },
      output: {
        filename: 'bundle.js?[hash]'
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: `./src/${base || 'index'}.html`
        }),
        new webpack.ProgressPlugin(),
        new VueLoaderPlugin(),
        new AssetsPlugin(),
        new webpack.DefinePlugin(
          buildDefinePlugin({ mode }, {
            test: JSON.stringify('test'),
          })
        )
      ]
    },
    modeConfig(mode),
    presetConfig({ mode, presets }),
    vueConfig(mode),
  );
};
