const path = require('path')
const package = require(`${process.cwd()}/package.json`)
const ComponentsPlugin = require('unplugin-vue-components/webpack')
const NutUIResolver = require('@nutui/nutui-taro/dist/resolver')

const projectRootDir = process.cwd()

const buildTarget = process.env.TARO_ENV

const projectsDir = path.join(__dirname, '..', 'projects', './')

const projectDirName = projectRootDir.replace(projectsDir, '')

const patterns = []

if (buildTarget === 'weapp') {
  patterns.push({
    from: path.resolve(projectRootDir, 'sitemap.json'),
    to: path.resolve(__dirname, '..', 'build', projectDirName, buildTarget, './sitemap.json')
  })
}

if (buildTarget === 'alipay') {
  patterns.push({
    from: path.resolve(projectRootDir, 'mini.project.json'),
    to: path.resolve(__dirname, '..', 'build', projectDirName, buildTarget, './mini.project.json')
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
  outputRoot: path.resolve(__dirname, '..', 'build', projectDirName, buildTarget),
  plugins: [
    // '@tarojs/plugin-vue-devtools',
    '@tarojs/plugin-html',
    'plugin-taro-env',
    'taro-plugin-pinia'
  ],
  alias: {
    '@global': path.resolve(__dirname, '..'),
    '@': path.resolve(projectRootDir, 'src')
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
          limit: 1 // 设定转换尺寸上限
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
      if (buildTarget === 'alipay') {
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
          NutUIResolver({ taro: true })
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
          NutUIResolver({ taro: true })
        ]
      }))
    }
  }
}
