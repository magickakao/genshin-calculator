const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
    const isDevelopment = argv.mode === 'development';
    
    return {
        bail: false,
        
        entry: {
            'app': './src/js/app.js',
            'db': './src/js/db.js', 
            'ui': './src/js/ui.js'
        },
        
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'js/[name].js',
            publicPath: '/',
            clean: true,
        },
        
        stats: 'errors-warnings',
        
        plugins: [
            new webpack.DefinePlugin({
                __VERSION__: JSON.stringify(''),
                __DEVEL__: JSON.stringify(isDevelopment),
            }),
            
            new MiniCssExtractPlugin({
                filename: 'css/[name].css',
            }),
            
            // ВАЖНО: вернуть index.ejs!
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: './src/index.ejs',
                inject: true,
                templateParameters: {
                    'version': '',  // ПУСТАЯ СТРОКА
                },
                minify: false
            }),
            
            new CopyPlugin({
                patterns: [
                    { 
                        from: './src/images/', 
                        to: "images/",
                        noErrorOnMissing: true
                    },
                    { 
                        from: './src/help/', 
                        to: "help/",
                        noErrorOnMissing: true
                    },
                    { 
                        from: './src/fonts/', 
                        to: "fonts/",
                        noErrorOnMissing: true
                    },
                    { 
                        from: './src/js/lang/', 
                        to: "js/lang/",
                        noErrorOnMissing: true
                    }
                ],
            }),
        ],
        
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader'
                    ]
                },
                {
                    test: /\.(ttf|woff2?)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name][ext]'
                    }
                },
                {
                    test: /\.(png|svg|jpe?g|gif|webp)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name][ext]'
                    }
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', { 
                                    targets: "defaults",
                                    useBuiltIns: "entry",
                                    corejs: 3
                                }],
                                ['@babel/preset-react', { 
                                    runtime: 'automatic' 
                                }]
                            ]
                        }
                    }
                }
            ],
        },
        
        resolve: {
            extensions: ['.js', '.jsx'],
        },
        
        optimization: {
            minimize: !isDevelopment,
        },
        
        devtool: isDevelopment ? 'eval-source-map' : false,
    };
};