const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const base = require('./webpack.base.babel');

const HtmlWebpackPlugin = require('html-webpack-plugin');

// ## //

module.exports = base({
    entry: [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:4000',
        'webpack/hot/only-dev-server',
        'babel-regenerator-runtime',
        `${base.PATHS.app}/index`,
    ],

    output: {
        filename: 'scripts/bundle.js',
        chunkFilename: 'scripts/[name].chunk.js',
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),

        new HtmlWebpackPlugin({
            templateContent: fs.readFileSync(path.resolve(process.cwd(), 'src/index.html')).toString(),
            inject: true,
        }),
    ],

    devtool: 'eval-source-map',

    devServer: {
        port: 4000,
        hot: true,
        historyApiFallback: true,
        stats: {
            colors: true,
            cached: false,
            cachedAssets: false,
        },
    },
});
