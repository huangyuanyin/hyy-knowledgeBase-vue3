import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { join } from 'path'
import { createStyleImportPlugin, VxeTableResolve } from 'vite-plugin-style-import'
import UnoCSS from 'unocss/vite'

export default defineConfig(({ mode }) => {
  const environmentPrefix = {
    development: '/',
    staging: '/netKmp/',
    55: '/knowledge/'
  }
  return {
    base: environmentPrefix[mode],
    build: {
      outDir: './dist', // 指定输出目录为 "./dist"
      assetsDir: './assets', // 指定静态文件引入路径为 "./assets"
      minify: 'terser' // 使用 terser 进行代码压缩
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: 'Icon'
          })
        ],
        imports: ['vue', 'vue-router', 'pinia'],
        include: [/\.[tj]sx?$/, /\.vue\??/],
        dirs: ['./src/components', './src/hooks', './src/utils', './src/router', './src/api', './src/store'],
        dts: 'src/auto-imports.d.ts'
      }),
      Components({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            enabledCollections: ['ep']
          })
        ]
      }),
      Icons({
        autoInstall: true
      }),
      // createStyleImportPlugin({
      //   resolves: [VxeTableResolve()]
      // })
      UnoCSS()
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: join(__dirname, 'src/')
        }
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/style/scssConfig.scss";`
        }
      }
    }
  }
})
