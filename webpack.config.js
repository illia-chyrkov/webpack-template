const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const NunjucksWebpackPlugin = require('nunjucks-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const fs = require('fs')
const path = require('path')

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
		minimizer: [
			new OptimizeCSSAssetsPlugin({}),
			new UglifyJsPlugin({
				test: /\.js$/,
				exclude: /node_modules/,
				uglifyOptions: {
					output: { comments: false }
				}
			})
		]
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
				},
				transformPath (targePath) {
					return targePath.replace('fonts/','css/')
				}		 
			}
		]),
		new NunjucksWebpackPlugin({
			templates: htmlFiles
		})
	]
}
