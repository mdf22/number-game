
const path    = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const {AureliaPlugin}   = require("aurelia-webpack-plugin");

const WebpackEntryManifestPlugin = require("webpack-entry-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const htmlWebpackInjectAttributesPlugin = require("html-webpack-inject-attributes-plugin");
const HtmlWebpackExcludeAssetsPlugin = require("html-webpack-exclude-assets-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const glob = require("glob")
const CleanDirWebpackPlugin = require("cleandir-webpack-plugin");

const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const fs = require("fs");


const nodeEnv = process.env.NODE_ENV;
const isProduction = nodeEnv === "production";
const isDevelopment = nodeEnv === "development";
const isStaging = nodeEnv === "staging";

const publicPath = "/";
const srcDir = path.resolve(__dirname, "./src");
const outDir  = path.resolve(__dirname, "./dist");
const nodeModulesDir = path.resolve(__dirname, "./node_modules");



const postCssPlugins = function() {
  let postPluginConf = [];
  postPluginConf.push(
    require("autoprefixer")({
      cascade: true,
      remove: true,
    }),
  );
  if (isProduction || isStaging) {
    postPluginConf.push(
      require("cssnano")({
        discardComments: {
          removeAll: true,
        },
        autoprefixer: true,
        zindex: false,
        normalizeUrl: false,
      }),
    );
  }
  return postPluginConf;
};
function collectWhitelist() {
  return ['whitelisted'];
}
function collectWhitelistPatterns() {
  return [/^whitelisted-/];
}
function collectWhitelistPatternsChildren() {
  return [/^whitelisted-/];
}
/**
 * @return {webpack.Configuration}
 */


module.exports = {
      mode: isProduction || isStaging ? "production" : "development",
      stats: !isDevelopment ? "errors-only" : "normal",
      output: {
        publicPath: publicPath,
        path: outDir,
        filename: isDevelopment ? "assets/js/[name].js" : "assets/js/[hash].js"
      },

      entry:   {
          app: ["aurelia-pal", "aurelia-bootstrapper"],
          style: path.join(srcDir, 'app.scss'),
      },
      resolve: {
          symlinks: false,
          extensions: [".ts", ".js", ".css", ".scss"],
          modules:    [srcDir, nodeModulesDir],
      },
      module:  {
            rules: [
              {
                  test:    /\.ts$/i,
                  loader:  "ts-loader",
              },
              {
                  test: /\.css$/i,
                  issuer: [{
                      test: /\.html$/i,
                  }],
                  use: {
                      loader: "css-loader",
                      options: {
                          url: false
                      }
                  },
              },
              {
                  test:   /\.html$/i,
                  loader: "html-loader",
              },
              {
                  test:    /\.(png|gif|jpg|cur)$/i,
                  loader:  "url-loader",
                  options: {
                      publicPath: '/',
                      limit: 8192,
                  },
              },
              {
                  test:   /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                  loader: "url-loader",
              }, {
                  test:   /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                  loader: "file-loader",
              }, {
                test: /\.json$/i,
                loader: "json-loader",
                type: 'javascript/auto'

              }, {
                  test:    /\.(scss)$/i,
                  exclude: /node_modules/,
                  use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    },
                    {
                      loader: "postcss-loader",
                      options: {
                          postcssOptions: {
                              plugins: postCssPlugins,
                          }
                      },
                    },
                    {
                      loader: "sass-loader",
                    },
                  ],
              },
          ],
      },
      plugins: [
          // new BundleAnalyzerPlugin({
          //     analyzerMode:  'static',
          //     bundleStatsFile: '../doc/webpack.stats.json',
          //     reportFilename: '../doc/bundle.analyzer.html',
          //     openAnalyzer:false
          // }),
          new HtmlWebpackPlugin({
              template:       "./src/index.ejs",
              filename:       "./index.html",
              inject:         "body",
              attributes: {
                  "onload": function(tag) {
                      let result = tag.attributes.src || tag.attributes.href;
                      return "onChunkLoad('" + result + "')";
                  }
              }
          }),
          new DuplicatePackageCheckerPlugin({
            verbose: true,
            emitError: true,
            showHelp: false,
            strict: true,
          }),
          new AureliaPlugin(),
          new HtmlWebpackExcludeAssetsPlugin(),
          new htmlWebpackInjectAttributesPlugin(),

          /* TODO fix, remove, change manifest plugin */
          new WebpackEntryManifestPlugin({
            filename:  "assets/manifest.json"
          }),
          new MomentTimezoneDataPlugin({
            matchZones: /^America/,
            startYear: 2000,
            endYear: 2030,
          }),
          //new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /us|en/),
          new webpack.DefinePlugin({
            DEVELOPMENT: JSON.stringify(nodeEnv === "development"),
            STAGING: JSON.stringify(nodeEnv === "staging"),
          }),
          new MiniCssExtractPlugin({
            filename: isProduction || isStaging ? "assets/css/[hash].css" : "assets/css/[name].css",
          }),
          new CleanDirWebpackPlugin([
              'dist/assets/css', 'dist/assets/js', 'dist/assets/manifest.json', // and something else generated by build
              ],
            {
              stage:   "before",
              silent:  true,
              verbose:true
            },
          ),
          ...(isDevelopment? [
            new webpack.HotModuleReplacementPlugin(),
          ]:[]),
          ...(isStaging || isProduction? [
            new PurgecssPlugin({
              paths: glob.sync(srcDir + '/**/*.html' ),
              only: ['style'],
              whitelist: collectWhitelist,
              whitelistPatterns: collectWhitelistPatterns,
              whitelistPatternsChildren: collectWhitelistPatternsChildren
            })
          ]:[])

      ],

      optimization: {
        runtimeChunk: "single",
        splitChunks: {
          minChunks: 1,
          maxAsyncRequests: 20,
          maxInitialRequests: 5,

          minSize: !isDevelopment ? 51200 : 0,
          maxSize: !isDevelopment ? 2560000 : 0,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: "common",
              chunks: "all",
              minSize: !isDevelopment ? 51200 : 0,
              maxSize: !isDevelopment ? 2560000 : 0,
            },
          },
        },
        ...(!isDevelopment ? {
            minimizer: [new TerserPlugin({
              test: /\.js(\?.*)?$/i,
              exclude: /\/excludes/
            })]
          }
        :{})
      },
      devtool: !isDevelopment ? false : "inline-source-map",
      devServer: {
        https: true,
        port: 3000,
        contentBase: './dist',
        proxy: {
          "/numbersapi/*": {
              "changeOrigin": true,
              "secure": false,
              "target": 'http://numbersapi.com',
              pathRewrite: {
                  '^/numbersapi': ''
              }
          }
        }
      },
};

