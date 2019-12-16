const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require("fs");
const entries = (pagesPath = "./src/pages") =>
  fs.readdirSync(path.resolve(pagesPath)).reduce((p, name) => {
    if (fs.statSync(path.resolve(pagesPath, name)).isDirectory())
      p[name] = `${pagesPath}/${name}/index.js`;
    return p;
  }, {});
const htmls = (pagesPath = "./src/pages") =>
  fs.readdirSync(path.resolve(pagesPath)).reduce((p, name) => {
    console.log(name);
    p.push(
      new HtmlWebpackPlugin({
        filename: name,
        chunks: ["venders", name.replace(".html", "")],
        template: `${pagesPath}/${name}/index.html`,
        favicon: "./src/assets/favicon.ico"
      })
    );
    return p;
  }, []);

const config = {
  // This option controls if and how source maps are generated.
  // https://webpack.js.org/configuration/devtool/
  devtool: "eval-cheap-module-source-map",

  // https://webpack.js.org/concepts/entry-points/#multi-page-application
  entry: entries(),

  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    port: 8080,
    contentBase: path.join(__dirname, "dist"),
    writeToDisk: false, // https://webpack.js.org/configuration/dev-server/#devserverwritetodisk-
    proxy: {
      "/api": {
        // 转发规则
        target: "http://localhost:3000", // 后端接口地址
        pathRewrite: { "^/api": "" }, // 路径重写
        secure: false // 参考: https://webpack.js.org/configuration/dev-server/#devserverproxy
      }
    }
  },

  // https://webpack.js.org/concepts/loaders/
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        }
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader"
          // Please note we are not running postcss here
        ]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        // Load all images as base64 encoding if they are smaller than 8192 bytes
        test: /\.(png|jpg|gif|svg|jpeg)$/,
        use: [
          {
            loader: "url-loader",

            options: {
              // On development we want to see where the file is coming from, hence we preserve the [path]
              name: "[path][name].[ext]?hash=[hash:20]",
              limit: 8192
            }
          }
        ]
      }
    ]
  },

  // https://webpack.js.org/concepts/plugins/
  plugins: [...htmls()]
};
console.log(config.devServer.port);
module.exports = config;
