const CopyPlugin = require('copy-webpack-plugin')
const WrapperPlugin = require('wrapper-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')

const { author } = require('./package.json')

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    bundle: './js/main.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].bundle.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/js'),
      '~': path.resolve(__dirname, 'src'),
    },
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        extractComments: false,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  devServer: {
    compress: true,
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(njk|nunjucks)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].html',
            },
          },
          {
            loader: 'nunjucks-html-loader',
            options: {
              searchPaths: [path.resolve(__dirname, 'src/views')],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/bundle.css',
    }),
    new WrapperPlugin({
      test: /\.js$/,
      footer: `window.author="${author}";`,
    }),
    new CopyPlugin({
      patterns: [
        { from: 'img/**/*' },
        // {
        // 	from: 'fonts/**/*',
        // 	transformPath(targePath) {
        // 		return targePath.replace('fonts/', 'css/')
        // 	},
        // },
      ],
    }),
  ],
}
