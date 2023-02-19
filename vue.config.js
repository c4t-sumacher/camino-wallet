const TerserPlugin = require('terser-webpack-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const ProvidePlugin = require('webpack/lib/ProvidePlugin')
//const { VueLoaderPlugin } = require('vue-loader')
//const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
//const deps = require('./package.json').dependencies
const HtmlWebPackPlugin = require('html-webpack-plugin')
const path = require('path')
process.env.VUE_APP_VERSION = process.env.npm_package_version

module.exports = {
    transpileDependencies: ['vuetify'],
    devServer: {
        /**
         * For e2e testing we turn this off using vue cli --mode e2e
         * @link https://cli.vuejs.org/guide/mode-and-env.html#modes
         */
        https: !process.env.USE_HTTP,
        port: 5000,
    },
    // publicPath: '',
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            config.optimization = {
                minimize: true,
                minimizer: [new TerserPlugin()],
                splitChunks: {
                    chunks: 'all',
                    minSize: 600 * 1000,
                    maxSize: 2000 * 1000,
                },
            }
        }
        if (process.env.NODE_ENV === 'plugin') {
            config.plugins = [
                //new VueLoaderPlugin(),
                //new VuetifyLoaderPlugin(),
                //new NodePolyfillPlugin(),
                new ModuleFederationPlugin({
                    name: 'wallet',
                    filename: 'remoteEntry.js',
                    remotes: {},
                    exposes: {
                        './store': './src/store/index.ts',
                        './mountApp': './src/bootloader.ts',
                        './AvaNetwork': './src/js/AvaNetwork.ts',
                        './moutHomePage': './src/mountHomePage.ts',
                        './mountCreate': './src/mounts/createMount.ts',
                        './mountAccessComponents': './src/mounts/mountAccessComponents.ts',
                        './mountLegal': './src/mounts/mountLegal.ts',
                        './mountAccountMenu': './src/mounts/mountAccountMenu.ts',
                        './mountAccounts': './src/mounts/mountAccounts.ts',
                    },
                    shared: {
                        //...deps,
                        vue: {
                            singleton: true,
                            eager: true,
                            //    version: deps.vue,
                        },
                    },
                }),
                new HtmlWebPackPlugin({
                    template: path.resolve(__dirname, 'public/index.html'),
                    favicon: './public/favicon.ico',
                }),
            ]
        }
        config.resolve = {
            extensions: ['.tsx', '.ts', '.js', '.vue'],
            fallback: {
                assert: require.resolve('assert/'),
                buffer: require.resolve('buffer/'),
                crypto: require.resolve('crypto-browserify'),
                http: false,
                https: false,
                os: false,
                stream: require.resolve('stream-browserify'),
            },
            alias: {
                '@': path.resolve(__dirname, 'src/'),
                '/img': false,
            },
        }
        config.plugins.push(
            new ProvidePlugin({
                process: 'process/browser',
                Buffer: ['buffer', 'Buffer'],
            })
        )
    },
    pwa: {
        name: 'Camino Wallet',
        manifestOptions: {
            start_url: '/',
        },
        iconPaths: {
            favicon16: 'img/icons/favicon-16x16.png',
            favicon32: 'img/icons/favicon-32x32.png',
            appleTouchIcon: 'img/icons/apple-touch-icon.png',
            maskIcon: 'img/icons/favicon-32x32.png',
            msTileImage: 'img/icons/mstile-150x150.png',
        },
    },
}
