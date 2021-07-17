const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const path = require('path')

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    bundle: './js/main.js',
  },
  output: {
    path: path.join(__dirname, 'docs'),
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
    minimizer: ['...', new CssMinimizerPlugin()],
  },
  devtool:
    process.env.NODE_ENV === 'development'
      ? 'eval-cheap-module-source-map'
      : false,
  devServer: {
    contentBase: path.resolve(__dirname, './docs'),
    open: true,
    compress: true,
    host: '0.0.0.0',
    port: 8080,
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
