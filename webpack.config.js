var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var debug = process.env.NODE_ENV !== "production";
module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : false,
  entry: "./entry.js",
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "bundle.js"
  },
  module: {
    /*
    rules: [
    {
        test: /\.css$/,
        loader: ['css-loader']
      },  
      {
        test: /\.scss$/,
        loader: ['css-loader', 'resolve-url-loader', 'sass-loader']
      },
      
    ]
    */
    rules: [
    {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },  
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'resolve-url-loader', 'sass-loader']
        })
      },
      {
        test: /\.eot/,
        loader: 'url-loader?mimetype=application/vnd.ms-fontobject'
      },
      {
        test: /\.ttf/,
        loader: 'url-loader?mimetype=application/x-font-ttf'
      },
      {
        test: /\.woff/,
        loader: 'url-loader?mimetype=application/font-woff'
      },
      {
        test: /\.woff2/,
        loader: 'url-loader?mimetype=application/font-woff2'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      },
    ]
    
  },
  plugins: debug ? 
  [
    new ExtractTextPlugin("./css/main.css")
  ] :
  [
    new ExtractTextPlugin("./css/main.css"),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};