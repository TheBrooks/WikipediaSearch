var debug = process.env.NODE_ENV !== "production";
module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : false,
  entry: "./js/scripts.js",
  output: {
    path: __dirname + "/js",
    filename: "scripts.min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};