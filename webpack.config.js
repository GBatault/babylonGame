var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");

var basePath = __dirname;

module.exports = environment => {

	const mode = environment.production ? "production" : "development";
	const outPath = environment.production ?  path.join(basePath, "cordova/cardGame/www") : path.join(basePath, "dist");

	const config = {
		mode : mode,
		context: path.join(basePath, "src"),
		resolve: {
			extensions: [".js", ".ts", ".tsx"]
		},
		entry: [
			"./index.ts",
			"./assets/css/style.css"
		],
		output: {
			path: outPath,
			filename: "bundle.js"
		},
		devtool: "source-map",
		devServer: {
			contentBase: "./dist", // Content base
			inline: true, // Enable watch and live reload
			host: "localhost",
			port: 8080,
			stats: "errors-only",
			historyApiFallback: true
		},
		module: {
			rules: [
				{
					test: /\.ts?$/,
					exclude: /node_modules/,
					loader: "awesome-typescript-loader",
				},
				{
					test: /\.css$/,
					exclude: /node_modules/,
					use: [
						MiniCssExtractPlugin.loader,
						"css-loader"
					]
				},
				{	 
					test: /\.(jpe?g|gif|png|svg|stl)$/, 
					loader: "file-loader",
					options: {
						name: "[path][name].[ext]"
					}   
				}
			]
		},
		plugins: [
			// Generate index.html in /dist
			new HtmlWebpackPlugin({
				filename: "index.html", // Name of file in ./dist/
				template: "index.html", // Name of template in ./src
				favicon: "assets/icon/favicon.png",
				hash: true
				}),
			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output
				// both options are optional
				filename: "[name].css",
				chunkFilename: "[id].css"
			})
		]
	}
	return config;
}