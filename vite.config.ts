import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { join } from 'path'

export default defineConfig({
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
      dirs: ['./src/components', './src/hooks', './src/utils', './src/router'],
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
    })
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
})
