const path = require("path"),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    commonConfig = require("./webpack.config"),
    hwp = require("./src/config/config.webpack.hwp")("prod"),
    merge = require("webpack-merge");

module.exports = merge(commonConfig, {
    output: {
        path: path.resolve(__dirname, './phpStudy/PHPTutorial/WWW/prod/js'),
    },
    mode: "production",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(png|gif|jpg)$/,
                use: {
                    loader: 'url-loader',
                    options : {
                        limit: "30000",
                        outputPath: "../res/img",
                        name : "[hash].[ext]"
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(path.resolve(__dirname, "./phpStudy/PHPTutorial/WWW/prod")),
        ...hwp,
        new ExtractTextPlugin("../css/[name]-[chunkhash].css")
    ]
});