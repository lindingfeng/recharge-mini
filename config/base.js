const path = require('path')
const package = require(`${process.cwd()}/package.json`)
const ComponentsPlugin = require('unplugin-vue-components/webpack')
const NutUIResolver = require('@nutui/nutui-taro/dist/resolver')

const projectRootDir = path.resolve(__dirname, '..', 'projects', package.outputRoot)

const patterns = []

if (process.env.TARO_ENV === 'weapp') {
  patterns.push({
    from: `${projectRootDir}/sitemap.json`,
    to: path.resolve(__dirname, '..', 'build', process.env.TARO_ENV, package.outputRoot, './sitemap.json')
  })
}

if (process.env.TARO_ENV === 'alipay') {
  patterns.push({
    from: `${projectRootDir}/mini.project.json`,
    to: path.resolve(__dirname, '..', 'build', process.env.TARO_ENV, package.outputRoot, './mini.project.json')
  })
}

module.exports = {
  projectName: package.projectName || '小程序',
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1
  },
  env: {
    VUE_APP_PROJECT: `"${package.project}"`
  },
  sourceRoot: 'src',
  // outputRoot: path.resolve(__dirname, '..', 'dist', package.outputRoot),
  // Taro内部应该使用path处理outputRoot，所以配置绝对路径会报错，暂时先用相对路径，相对于启动目录
  outputRoot: `../../build/${process.env.TARO_ENV}/${package.outputRoot}`,
  plugins: [
    // '@tarojs/plugin-vue-devtools',
    '@tarojs/plugin-html',
    'plugin-taro-env',
    'taro-plugin-pinia'
  ],
  alias: {
    '@global': path.resolve(__dirname, '../'),
    '@': path.resolve(__dirname, '..', 'projects', package.outputRoot, 'src')
  },
  sass: {
    data: `@import "@nutui/nutui-taro/dist/styles/variables.scss";`,
  },
  defineConstants: {
  },
  copy: {
    patterns,
    options: {
    }
  },
  framework: 'vue3',
  compiler: {
    type: 'webpack5',
    prebundle: {
      // 设置true开发模式会报错 https://github.com/NervJS/taro/issues/13456
      enable: false
    }
  },
  mini: {
    postcss: {
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true
    },
    optimizeMainPackage: {
      enable: true
    },
    webpackChain(chain) {
      // fix: 支付宝小程序报错Cannot read properties of null (reading 'addEventListener')
      // doc: https://github.com/NervJS/taro/issues/12420
      if (process.env.TARO_ENV === 'alipay') {
        chain.merge({
          module: {
            rule: [
              {
                test: /.js$/,
                loader: "babel-loader",
              },
            ]
          }
        })
      }
      // 按需加载
      chain.plugin('unplugin-vue-components').use(ComponentsPlugin({
        resolvers: [
          // 需要的可以配置自定义组件按需加载（不需要写导入语句）
          // (componentName) => {
          //   console.log('componentName', componentName)
          //   // where `componentName` is always CapitalCase
          //   // if (componentName.startsWith('Van'))
          //   // return { name: componentName.slice(3), from: 'vant' }
          // },
          NutUIResolver({taro: true})
        ]
      }))
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      pxtransform: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true
    },
    webpackChain(chain) {
      // 按需加载
      chain.plugin('unplugin-vue-components').use(ComponentsPlugin({
        resolvers: [
          NutUIResolver({taro: true})
        ]
      }))
    }
  }
}
