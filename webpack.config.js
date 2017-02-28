var debug = process.env.NODE_ENV !== "production";
module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : false,
  entry: "./js/entry.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};