const path = require('path');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  ]

  if (isDev) {
    // loaders.push('eslint-loader')
  }

  return loaders
}

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
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