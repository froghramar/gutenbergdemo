const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, { mode = 'development' }) => ({
  mode,
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: mode === 'production' ? '[name].[contenthash:8].js' : '[name].js',
    publicPath: process.env.PUBLIC_PATH || '/',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    alias: {
      // ESM .mjs imports; point to real files so nested node_modules resolve from project root
      'diff/lib/diff/character': path.resolve(__dirname, 'node_modules/diff/lib/diff/character.js'),
      'fast-deep-equal': path.resolve(__dirname, 'node_modules/fast-deep-equal'),
      // yjs expects deepFreeze from lib0/object; some lib0 versions don't export it
      'lib0/object': path.resolve(__dirname, 'src/shim-lib0-object.js'),
      // block-editor expects 'edit' icon; @wordpress/icons 11.x exports 'pencil'
      '@wordpress/icons': path.resolve(__dirname, 'src/shim-wordpress-icons.js'),
    },
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
        use: {
          loader: 'ts-loader',
          options: {
          configFile: 'tsconfig.app.json',
          compilerOptions: { noEmit: false },
        },
        },
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
  performance: {
    hints: false,
  },
})
