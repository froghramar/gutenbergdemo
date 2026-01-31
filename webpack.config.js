const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, { mode = 'development' }) => ({
  mode,
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: mode === 'production' ? '[name].[contenthash:8].js' : '[name].js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    fallback: {
      fs: false,
      path: false,
      url: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  devServer: {
    static: { directory: path.join(__dirname, 'public') },
    port: 5173,
    hot: true,
  },
  devtool: mode === 'development' ? 'eval-cheap-module-source-map' : 'source-map',
})
