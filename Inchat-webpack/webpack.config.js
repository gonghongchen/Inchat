const path = require("path"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    { entry, names } = require("./src/config/config.webpack.entry");
    
module.exports = {
    entry,
    output: {
        hashDigestLength: 4,
        filename: '[name]-[chunkhash].js'
    },
    resolve: {
        extensions: [
            '.ts',
            '.tsx',
            '.js'
        ]
    },
    module: {
        rules: [
            {
				test: /\.(css|less)$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [{
							loader: "css-loader",
							options: {
								modules: true,
								minimize: true,
								localIdentName: "[local]"
							}
						},
						{
							loader: "postcss-loader",
							options: {
								plugins: [
									require('autoprefixer')
								]
							}
                        },
                        {
                            loader: "less-loader"
                        }
					]
				})
			},
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader"
                }
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test : /\.html$/,
                use : {
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src'],
                        minimize: true
                    }
                }
            }
        ]
    },
    // plugins: [
	// 	new webpack.optimize.CommonsChunkPlugin({
	// 		name: "common",
	// 		filename: "[name]-[chunkhash].js",
	// 		minChunks: 2,
	// 		chunks: names
	// 	})
	// ]
}
