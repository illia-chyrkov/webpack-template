const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const NunjucksWebpackPlugin = require('nunjucks-webpack-plugin')
const fs = require('fs')

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
		filename: 'js/bundle.js',
		library: '[name]'
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

				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								minimize:
									process.env.NODE_ENV !== 'development',
								url: false
							}
						},
						{
							loader: 'postcss-loader'
						},
						{
							loader: 'sass-loader'
						}
					]
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('css/style.css'),
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