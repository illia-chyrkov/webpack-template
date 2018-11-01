const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')
const NunjucksWebpackPlugin = require('nunjucks-webpack-plugin')

const fs = require('fs')
const path = require('path')

const devMode = process.env.NODE_ENV !== 'production'

const htmlFiles = fs
	.readdirSync('./app/')
	.filter(function(file) {
		return file.search(/\.html$/gi) >= 0
	})
	.map(file => {
		return {
			from: './app/' + file,
			to: file
		}
	})

module.exports = {
	context: __dirname + '/app',
	entry: './js/app.js',
	output: {
		path: __dirname + '/dist',
		filename: 'js/bundle.js'
	},
	resolve: {
		alias: {
			'~': path.resolve(__dirname, 'app/js/')
		}
	},
	optimization: {
		minimizer: [new OptimizeCSSAssetsPlugin({})]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.sass$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							minimize: devMode,
							url: false
						}
					},
					'postcss-loader',
					'sass-loader'
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/style.css'
		}),
		new CopyWebpackPlugin([
			{
				from: {
					glob: 'img/**/*',
					dot: true
				}
			},
			{
				from: {
					glob: 'fonts/**/*',
					dot: true
				}
			}
		]),
		new NunjucksWebpackPlugin({
			templates: htmlFiles
		})
	]
}
