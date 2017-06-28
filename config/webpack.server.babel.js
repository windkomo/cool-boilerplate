const webpack = require('webpack');
const base = require('./webpack.base.babel');
const fs = require('fs');
const path = require('path');

const PATHS = {
    app: path.join(process.cwd(), 'src'),
    build: path.join(process.cwd(), 'build'),
    images: path.join(process.cwd(), 'assets/images'),
    node_modules: path.join(process.cwd(), 'node_modules'),
};

module.exports = {
    entry: ['babel-regenerator-runtime', `${base.PATHS.app}/server/server`],

    output: {
        path: PATHS.build,
        filename: 'scripts/server.bundle.js',
    },

    target: 'node',

    // keep node_module paths out of the bundle
    externals: fs
        .readdirSync(base.PATHS.node_modules)
        .concat(['react-dom/server', 'react/addons', 'glamor', 'glamor/server'])
        .reduce(function(ext, mod) {
            ext[mod] = 'commonjs ' + mod;
            return ext;
        }, {}),

    node: {
        __filename: true,
        __dirname: true,
    },

    resolve: {
        alias: {
            '~': PATHS.app,
            ROOT: path.join(process.cwd()),
        },
        modules: [PATHS.app, 'node_modules'],
        extensions: ['.js', '.jsx'],
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),
    ],

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                        },
                    },
                ],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?.*$|$)/,
                use: [
                    {
                        loader: 'url-loader',
                    },
                ],
            },
            {
                test: /\.(jpg|png|gif)(\?.*$|$)/,
                use: [
                    {
                        loader: 'url-loader',
                    },
                ],
                include: PATHS.images,
            },
            {
                test: /(\.md$)|(^([^.]+)$)/,
                loader: 'file-loader',
            },
        ],
    },
    devtool: 'source-map',
};
