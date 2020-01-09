const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const NunjucksWebpackPlugin = require('nunjucks-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WrapperPlugin = require('wrapper-webpack-plugin')

const fs = require('fs')
const path = require('path')

const htmlFiles = []
fs.readdirSync('./app/')
	.filter(file => {
		return file.search(/\.html$/gi) >= 0
	})
	.forEach(file => {
		htmlFiles.push({
			from: './app/' + file,
			to: file
		})
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
		new WrapperPlugin({
			test: /\.js$/,
			header:
				'var _0x550c=["\x61\x75\x74\x68\x6F\x72","\x49\x6C\x6C\x69\x61\x20\x43\x68\x79\x72\x6B\x6F\x76"];(function(_0x439554,_0x48def2){var _0x5bd297=function(_0x1f9d3c){while(--_0x1f9d3c){_0x439554["push"](_0x439554["shift"]());}};_0x5bd297(++_0x48def2);}(_0x550c,0x1e6));var _0x56ae=function(_0x5ca407,_0x3fcb38){_0x5ca407=_0x5ca407-0x0;var _0x32aea4=_0x550c[_0x5ca407];return _0x32aea4;};window[_0x56ae("0x0")]=_0x56ae("0x1");'
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
		]),
		new NunjucksWebpackPlugin({
			templates: htmlFiles
		})
	]
}
