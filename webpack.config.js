const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const NunjucksWebpackPlugin = require('nunjucks-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

let plugins = [
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify(
			process.env.NODE_ENV || 'development'
		)
	}),
	new ExtractTextPlugin({
		filename: 'css/style.css',
		disable: false,
		allChunks: true
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
		template: [{
            from: './app/index.html',
            to: 'index.html'
        }]
	})
]

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
				test: /\.sass$/,
				loader: ExtractTextPlugin.extract({ use: [
					{
						loader: 'css-loader',
		              	options: {
		                  	minimize: process.env.NODE_ENV !== 'development',
		                  	url: false
		              	}
					},
					{
						loader: 'autoprefixer-loader',
						options: {
							browsers: ["last 2 version", "> 1%"]
						}
					},
					{
						loader: 'sass-loader'
					},
				] })
			},
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
                test: /\.html$/,
                loader: 'nunjucks-loader'
            }
		]
	},
	plugins:
		process.env.NODE_ENV === 'production'
			? [
				...plugins,
				new UglifyJSPlugin({
					cache: true,
					parallel: true
				})
			]
			: [...plugins]
}