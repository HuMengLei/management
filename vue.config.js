let path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css']; //定义压缩文件类型
const TerserPlugin = require('terser-webpack-plugin');

function resolve(dir) {
	return path.join(__dirname, dir)
}
module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/management/' : '/',
	outputDir: 'management',
	assetsDir: 'static',
	lintOnSave: false,
	chainWebpack: config => {
		config.resolve.alias.set('@', resolve('src')),
			// 移除prefetch 插件
			config.plugins.delete('prefetch');
		// 配置svg默认规则排除icons目录中svg文件处理
		config.module
			.rule("svg")
			.exclude.add(resolve("src/icons"))
			.end();
		// 新增icons规则，设置svg-sprite-loader处理icons目录中svg文件
		config.module
			.rule("icons")
			.test(/\.svg$/)
			.include.add(resolve("src/icons"))
			.end()
			.use("svg-sprite-loader")
			.loader("svg-sprite-loader")
			.options({
				symbolId: "icon-[name]"
			})
			.end();
	},
	productionSourceMap: false,//去除map文件
	devServer: {
		proxy: {
			[process.env.VUE_APP_BASE_API]: {
				target: 'http://192.168.3.28:9999/', //对应开发时的接口45:8090,253:8080
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					['^' + process.env.VUE_APP_BASE_API]: ''
				}
			}
		}
	},
	//scss的全局变量的使用
	css: {
		sourceMap: true,
		loaderOptions: {
			sass: {
				prependData: ` @import "@/assets/styles/variable.scss";`
			}
		}
	},
	configureWebpack: config => {
		// 文件压缩相关配置
		config.plugins.push(new CompressionWebpackPlugin({
			filename: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
			threshold: 10240,
			minRatio: 0.8
		}));
		//公共代码抽离splitChunks
		config.optimization = {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					cache: true, //启用文件缓存
					test: /\.js(\?.*)?$/i,    //匹配参与压缩的文件
					parallel: true,    //使用多进程并发运行
					terserOptions: {    //Terser 压缩配置
						compress: {
							drop_console: true, // 去除console语句
							drop_debugger: true // 去除debugger语句
						}
					},
					extractComments: true,    //将注释剥离到单独的文件中
				})
			],
			splitChunks: {
				cacheGroups: {
					vendor: {
						chunks: 'all',
						test: /node_modules/,
						name: 'vendor',
						minChunks: 1,
						maxInitialRequests: 5,
						minSize: 0,
						priority: 100
					},
					common: {
						chunks: 'all',
						test: /[\\/]src[\\/]js[\\/]/,
						name: 'common',
						minChunks: 2,
						maxInitialRequests: 5,
						minSize: 0,
						priority: 60
					},
					styles: {
						name: 'styles',
						test: /\.(sa|sc|c)ss$/,
						chunks: 'all',
						enforce: true
					},
					runtimeChunk: {
						name: 'manifest'
					}
				}
			}
		};


	}
}
