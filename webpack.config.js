const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WrapperPlugin = require('wrapper-webpack-plugin')
const path = require('path')

const { author } = require('./package.json')

module.exports = {
	context: __dirname + '/src',
	entry: {
		bundle: './js/main.js'
	},
	output: {
		path: __dirname + '/dist',
		filename: 'js/[name].js',
		chunkFilename: 'js/[name].bundle.js'
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src/js'),
			'~': path.resolve(__dirname, 'src')
		}
	},
	optimization: {
		minimizer: [
			new TerserJSPlugin({
				extractComments: false
			}),
			new OptimizeCSSAssetsPlugin({})
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
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							url: false
						}
					},
					'postcss-loader'
				]
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
			},
			{
				test: /\.(njk|nunjucks)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[path][name].html'
						}
					},
					{
						loader: 'nunjucks-html-loader',
						options: {
							searchPaths: [path.resolve(__dirname, 'src/views')]
						}
					}
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/style.css'
		}),
		new WrapperPlugin({
			test: /\.js$/,
			footer: `window.author="${author}";`
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
				transformPath(targePath) {
					return targePath.replace('fonts/', 'css/')
				}
			}
		])
	]
}
