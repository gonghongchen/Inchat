const path = require("path"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    names = require("./config.webpack.entry").names;

module.exports = (cate = "dev") => {
    return names.map((name) => {
        return new HtmlWebpackPlugin({
            filename: ((cate) => {
                return cate === "dev" ? path.resolve(__dirname, `../../${cate}/${name}.html`) : path.resolve(__dirname, `../../${cate}/html/${name}.html`);
            })(cate),
            template: path.resolve(__dirname, `../${name}.html`),   //============================当某个tsx文件没有对应的HTML文件时，编译会报错，这里可以处理一下
            chunks: [
                // "babelPolyfill",
                name
            ],
            chunksSortMode: 'manual'
        });
    });
};