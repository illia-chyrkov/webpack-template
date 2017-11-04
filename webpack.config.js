const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const NunjucksWebpackPlugin = require('nunjucks-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')


module.exports = {
	context: __dirname + '/app',
	entry: './js/app.js',
	output: {
		path: __dirname + '/dist',
		filename: 'js/bundle.js',
		library: '[name]'
	},
	devtool: process.env.NODE_ENV === 'development' ? '#cheap-module-source-map' : '(none)',
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
	plugins: [
		new UglifyJSPlugin({ sourceMap: process.env.NODE_ENV === 'development' }),
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
			template: [{
	            from: './app/index.html',
	            to: 'index.html'
	        }]
		})
	]
}