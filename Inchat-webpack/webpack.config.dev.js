const path = require("path"),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    commonConfig = require("./webpack.config"),
    hwp = require("./src/config/config.webpack.hwp")("dev"),
    merge = require("webpack-merge");

module.exports = merge(commonConfig, {
    output: {
        path: path.resolve(__dirname, 'dev'),
    },
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        open: false,
        inline: true,
        contentBase: path.join(__dirname, "dev"),
        compress: true,
        port: 8090,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.(png|gif|jpg)$/,
                use: {
                    loader: 'url-loader',
                    options : {
                        limit: "30000",
                        outputPath: "res/img",
                        name : "[hash].[ext]"
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(path.resolve(__dirname, "dev")),
        ...hwp,
        new ExtractTextPlugin("[name]-[chunkhash].css")
    ]
});