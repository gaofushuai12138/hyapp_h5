const path = require('path')
const { defineConfig } = require('@vue/cli-service')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = defineConfig({
  publicPath: './',
  outputDir: 'dist',
  lintOnSave: true,// 是否在保存的时候检查
  devServer: {// 环境配置
      host: 'localhost',
      // host: '192.168.100.127',
      port: 8088,
      open: true, //配置自动启动浏览器

      // proxy: "http://hyapp.nongzongbu.com",
      proxy: {
        "/api": {
          target: "http://localhost:80/hyapp",
          secure: false,
          changeOrigin: true,
          logLevel: "debug",
          pathRewrite: {
            '^/api': '/'
          }
        },
      },
  },
  
  // vue3.0
  chainWebpack: config => {
    config.resolve.alias
        .set("@", resolve("src"))
        .set("assets", resolve("src/assets"))
        .set("components", resolve("src/components"))
        .set("views", resolve("src/views"))
        .set("plugin", resolve("src/plugin"))
    // .set("base", resolve("baseConfig"))
    // .set("public", resolve("public"));
    config.plugin("html")
          .tap(args => {
            args[0].title="湖羊通"
            args[0].is_pc_browser=true

            return args
          })
  },
  // transpileDependencies: true
})
