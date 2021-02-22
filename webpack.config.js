const path = require('path');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

module.exports = {
  entry:  path.resolve(__dirname, '../assets/src/index.js'),
  output: {
    publicPath: '/',
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
    compress: true,
    port: 3000,
    contentBase: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{
            loader: 'babel-loader',
            options: {
                cacheDirectory: true,
                plugins: ['@babel/plugin-transform-runtime']
            }
        }]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ]
      },
      {
          test: /\.(png|jpe?g|gif|svg)$/,
          use: [
              {
                  loader: "file-loader",
                  options: {
                    publicPath: isDev ? '/images/' : '/local/templates/sqb/assets/dist/images/',
                    outputPath: 'images'
                  }
              }
          ]
      },
      {
          test: /\.(woff|woff2|ttf|otf|eot)$/,
          use: [
              {
                  loader: "file-loader",
                  options: {
                      outputPath: 'fonts'
                  }
              }
          ]
      }
    ]
  },
  plugins: [
    new ReactRefreshPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
          template: "./public/index.html"
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle.css'
    })
  ]
};