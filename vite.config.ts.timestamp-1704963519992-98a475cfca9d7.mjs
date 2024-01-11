// vite.config.ts
import { defineConfig } from "file:///E:/%E9%A1%B9%E7%9B%AE/hyy-knowledgeBase-vue3/node_modules/.pnpm/registry.npmmirror.com+vite@4.4.8_@types+node@20.4.8_sass@1.64.2/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/%E9%A1%B9%E7%9B%AE/hyy-knowledgeBase-vue3/node_modules/.pnpm/registry.npmmirror.com+@vitejs+plugin-vue@4.2.3_vite@4.4.8_vue@3.3.4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///E:/%E9%A1%B9%E7%9B%AE/hyy-knowledgeBase-vue3/node_modules/.pnpm/registry.npmmirror.com+unplugin-auto-import@0.16.6/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///E:/%E9%A1%B9%E7%9B%AE/hyy-knowledgeBase-vue3/node_modules/.pnpm/registry.npmmirror.com+unplugin-vue-components@0.25.1_vue@3.3.4/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///E:/%E9%A1%B9%E7%9B%AE/hyy-knowledgeBase-vue3/node_modules/.pnpm/registry.npmmirror.com+unplugin-vue-components@0.25.1_vue@3.3.4/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import Icons from "file:///E:/%E9%A1%B9%E7%9B%AE/hyy-knowledgeBase-vue3/node_modules/.pnpm/registry.npmmirror.com+unplugin-icons@0.16.5/node_modules/unplugin-icons/dist/vite.mjs";
import IconsResolver from "file:///E:/%E9%A1%B9%E7%9B%AE/hyy-knowledgeBase-vue3/node_modules/.pnpm/registry.npmmirror.com+unplugin-icons@0.16.5/node_modules/unplugin-icons/dist/resolver.mjs";
import { join } from "path";
import UnoCSS from "file:///E:/%E9%A1%B9%E7%9B%AE/hyy-knowledgeBase-vue3/node_modules/.pnpm/unocss@0.58.0_postcss@8.4.27_vite@4.4.8/node_modules/unocss/dist/vite.mjs";
var __vite_injected_original_dirname = "E:\\\u9879\u76EE\\hyy-knowledgeBase-vue3";
var vite_config_default = defineConfig(({ mode }) => {
  return {
    base: mode === "development" ? "/" : "/netKmp/",
    build: {
      outDir: "./dist",
      // 指定输出目录为 "./dist"
      assetsDir: "./assets",
      // 指定静态文件引入路径为 "./assets"
      minify: "terser"
      // 使用 terser 进行代码压缩
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: "Icon"
          })
        ],
        imports: ["vue", "vue-router", "pinia"],
        include: [/\.[tj]sx?$/, /\.vue\??/],
        dirs: ["./src/components", "./src/hooks", "./src/utils", "./src/router", "./src/api", "./src/store"],
        dts: "src/auto-imports.d.ts"
      }),
      Components({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            enabledCollections: ["ep"]
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
          find: "@",
          replacement: join(__vite_injected_original_dirname, "src/")
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
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxcdTk4NzlcdTc2RUVcXFxcaHl5LWtub3dsZWRnZUJhc2UtdnVlM1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcXHU5ODc5XHU3NkVFXFxcXGh5eS1rbm93bGVkZ2VCYXNlLXZ1ZTNcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6LyVFOSVBMSVCOSVFNyU5QiVBRS9oeXkta25vd2xlZGdlQmFzZS12dWUzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXHJcbmltcG9ydCBJY29ucyBmcm9tICd1bnBsdWdpbi1pY29ucy92aXRlJ1xyXG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tICd1bnBsdWdpbi1pY29ucy9yZXNvbHZlcidcclxuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnXHJcbmltcG9ydCB7IGNyZWF0ZVN0eWxlSW1wb3J0UGx1Z2luLCBWeGVUYWJsZVJlc29sdmUgfSBmcm9tICd2aXRlLXBsdWdpbi1zdHlsZS1pbXBvcnQnXHJcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIGJhc2U6IG1vZGUgPT09ICdkZXZlbG9wbWVudCcgPyAnLycgOiAnL25ldEttcC8nLFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgb3V0RGlyOiAnLi9kaXN0JywgLy8gXHU2MzA3XHU1QjlBXHU4RjkzXHU1MUZBXHU3NkVFXHU1RjU1XHU0RTNBIFwiLi9kaXN0XCJcclxuICAgICAgYXNzZXRzRGlyOiAnLi9hc3NldHMnLCAvLyBcdTYzMDdcdTVCOUFcdTk3NTlcdTYwMDFcdTY1ODdcdTRFRjZcdTVGMTVcdTUxNjVcdThERUZcdTVGODRcdTRFM0EgXCIuL2Fzc2V0c1wiXHJcbiAgICAgIG1pbmlmeTogJ3RlcnNlcicgLy8gXHU0RjdGXHU3NTI4IHRlcnNlciBcdThGREJcdTg4NENcdTRFRTNcdTc4MDFcdTUzOEJcdTdGMjlcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHZ1ZSgpLFxyXG4gICAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcclxuICAgICAgICAgIEljb25zUmVzb2x2ZXIoe1xyXG4gICAgICAgICAgICBwcmVmaXg6ICdJY29uJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICBdLFxyXG4gICAgICAgIGltcG9ydHM6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInLCAncGluaWEnXSxcclxuICAgICAgICBpbmNsdWRlOiBbL1xcLlt0al1zeD8kLywgL1xcLnZ1ZVxcPz8vXSxcclxuICAgICAgICBkaXJzOiBbJy4vc3JjL2NvbXBvbmVudHMnLCAnLi9zcmMvaG9va3MnLCAnLi9zcmMvdXRpbHMnLCAnLi9zcmMvcm91dGVyJywgJy4vc3JjL2FwaScsICcuL3NyYy9zdG9yZSddLFxyXG4gICAgICAgIGR0czogJ3NyYy9hdXRvLWltcG9ydHMuZC50cydcclxuICAgICAgfSksXHJcbiAgICAgIENvbXBvbmVudHMoe1xyXG4gICAgICAgIHJlc29sdmVyczogW1xyXG4gICAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcigpLFxyXG4gICAgICAgICAgSWNvbnNSZXNvbHZlcih7XHJcbiAgICAgICAgICAgIGVuYWJsZWRDb2xsZWN0aW9uczogWydlcCddXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIF1cclxuICAgICAgfSksXHJcbiAgICAgIEljb25zKHtcclxuICAgICAgICBhdXRvSW5zdGFsbDogdHJ1ZVxyXG4gICAgICB9KSxcclxuICAgICAgLy8gY3JlYXRlU3R5bGVJbXBvcnRQbHVnaW4oe1xyXG4gICAgICAvLyAgIHJlc29sdmVzOiBbVnhlVGFibGVSZXNvbHZlKCldXHJcbiAgICAgIC8vIH0pXHJcbiAgICAgIFVub0NTUygpXHJcbiAgICBdLFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6ICdAJyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiBqb2luKF9fZGlybmFtZSwgJ3NyYy8nKVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIGNzczoge1xyXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgICAgc2Nzczoge1xyXG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6IGBAaW1wb3J0IFwiLi9zcmMvc3R5bGUvc2Nzc0NvbmZpZy5zY3NzXCI7YFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0UixTQUFTLG9CQUFvQjtBQUN6VCxPQUFPLFNBQVM7QUFDaEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFDcEMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsWUFBWTtBQUVyQixPQUFPLFlBQVk7QUFUbkIsSUFBTSxtQ0FBbUM7QUFXekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsU0FBTztBQUFBLElBQ0wsTUFBTSxTQUFTLGdCQUFnQixNQUFNO0FBQUEsSUFDckMsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBO0FBQUEsTUFDUixXQUFXO0FBQUE7QUFBQSxNQUNYLFFBQVE7QUFBQTtBQUFBLElBQ1Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLElBQUk7QUFBQSxNQUNKLFdBQVc7QUFBQSxRQUNULFdBQVc7QUFBQSxVQUNULG9CQUFvQjtBQUFBLFVBQ3BCLGNBQWM7QUFBQSxZQUNaLFFBQVE7QUFBQSxVQUNWLENBQUM7QUFBQSxRQUNIO0FBQUEsUUFDQSxTQUFTLENBQUMsT0FBTyxjQUFjLE9BQU87QUFBQSxRQUN0QyxTQUFTLENBQUMsY0FBYyxVQUFVO0FBQUEsUUFDbEMsTUFBTSxDQUFDLG9CQUFvQixlQUFlLGVBQWUsZ0JBQWdCLGFBQWEsYUFBYTtBQUFBLFFBQ25HLEtBQUs7QUFBQSxNQUNQLENBQUM7QUFBQSxNQUNELFdBQVc7QUFBQSxRQUNULFdBQVc7QUFBQSxVQUNULG9CQUFvQjtBQUFBLFVBQ3BCLGNBQWM7QUFBQSxZQUNaLG9CQUFvQixDQUFDLElBQUk7QUFBQSxVQUMzQixDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0QsTUFBTTtBQUFBLFFBQ0osYUFBYTtBQUFBLE1BQ2YsQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBLE1BSUQsT0FBTztBQUFBLElBQ1Q7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixhQUFhLEtBQUssa0NBQVcsTUFBTTtBQUFBLFFBQ3JDO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILHFCQUFxQjtBQUFBLFFBQ25CLE1BQU07QUFBQSxVQUNKLGdCQUFnQjtBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
