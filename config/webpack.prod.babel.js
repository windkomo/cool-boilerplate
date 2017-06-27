const webpack = require('webpack');
const base = require('./webpack.base.babel');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

// ## //

module.exports = base({
    entry: ['babel-regenerator-runtime', `${base.PATHS.app}/index`],

    output: {
        filename: 'scripts/[name].[chunkhash].js',
        chunkFilename: 'scripts/[name].[chunkhash].chunk.js',
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            children: true,
            minChunks: 2,
            async: true,
        }),

        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
        }),

        new HtmlWebpackPlugin({
            template: '!!raw-loader!src/index.ejs',
            filename: `${base.PATHS.build}/index.ejs`,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                // minifyCSS: true,
                minifyURLs: true,
            },
            inject: true,
        }),

        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer',
        }),
    ],

    devtool: 'source-map',
});
