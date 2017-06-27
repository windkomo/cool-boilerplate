const path = require('path');
const webpack = require('webpack');

// ## //

const PATHS = {
    app: path.join(process.cwd(), 'src'),
    lib: path.join(process.cwd(), 'lib'),
    shared: path.join(process.cwd(), 'shared'),
    build: path.join(process.cwd(), 'build'),
    images: path.join(process.cwd(), 'assets/images'),
    node_modules: path.join(process.cwd(), 'node_modules'),
};

module.exports = options => ({
    entry: options.entry,

    output: Object.assign(
        {
            path: PATHS.build,
            publicPath: '/',
        },
        options.output
    ),

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            babelrc: false,
                            presets: [
                                [
                                    'es2015',
                                    {
                                        modules: false,
                                    },
                                ],
                                'react',
                                'stage-1',
                            ],
                            plugins: [
                                'transform-decorators-legacy',
                                'react-hot-loader/babel',
                                'transform-class-properties',
                                'transform-async-to-generator',
                                'syntax-async-functions',
                            ],
                        },
                    },
                ],
                include: PATHS.app,
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
        ],
    },

    plugins: options.plugins.concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),
    ]),

    resolve: {
        alias: {
            '~': PATHS.app,
            ROOT: path.join(process.cwd()),
            react: path.join(process.cwd(), 'node_modules', 'react'),
        },
        modules: [PATHS.app, 'node_modules'],
        extensions: ['.js', '.jsx'],
    },

    devtool: options.devtool,

    devServer: options.devServer,

    target: 'web',

    stats: options.stats,
});

module.exports.PATHS = PATHS;
