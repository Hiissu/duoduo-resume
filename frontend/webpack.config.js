const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  entry: "./src/index.js",
  devtool: "inline-source-map",
  module: {
    rules: [
      // {
      //   test: /\.tsx?$/,
      //   use: 'ts-loader',
      //   exclude: /node_modules/,
      // },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpe?g|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    // publicPath: "/",
    publicPath: "/build/",
    // assetModuleFilename: 'images/[hash][ext][query]'
    assetModuleFilename: "images/[name][ext][query]",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "build"),
    },
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    // new webpack.DefinePlugin({
    //   REACT_APP_LEXICAL_VERSION: JSON.stringify("0.3.7"),
    //   // ENVIRONMENT: JSON.stringify(process.env.NODE_ENV),
    // }),
    new webpack.EnvironmentPlugin(["REACT_APP_LEXICAL_VERSION"]),
  ],
};
