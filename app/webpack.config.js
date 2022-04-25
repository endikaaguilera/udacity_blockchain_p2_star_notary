const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

var config = {
  mode: "development", // "production" | "development" | "none"
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'src/index.html' }],
    }),
  ],
  //devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  if (argv.mode === 'production') {
    config.devtool = false;
  }

  return config;
};