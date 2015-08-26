var path = require('path');

module.exports = {

  entry: {
    javascript: "./timeline.js"
  },

  output: {
    filename: "timeline-bundle.js",
    path: __dirname + "/dist",
    // export library name
    library: "timeline"
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: "/node_modules/",
        loaders: ["babel-loader"],
      }
    ],
  }
}
