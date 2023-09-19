// vite.config.ts
import { defineConfig } from "file:///E:/%E9%A1%B9%E7%9B%AE/hyy-knowledgeBase-vue3/node_modules/.pnpm/registry.npmmirror.com+vite@4.4.8_53i6sskcs2ajgjygegqe23wu6q/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/%E9%A1%B9%E7%9B%AE/hyy-knowledgeBase-vue3/node_modules/.pnpm/registry.npmmirror.com+@vitejs+plugin-vue@4.2.3_vite@4.4.8+vue@3.3.4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///E:/%E9%A1%B9%E7%9B%AE/hyy-knowledgeBase-vue3/node_modules/.pnpm/registry.npmmirror.com+unplugin-auto-import@0.16.6/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///E:/%E9%A1%B9%E7%9B%AE/hyy-knowledgeBase-vue3/node_modules/.pnpm/registry.npmmirror.com+unplugin-vue-components@0.25.1_vue@3.3.4/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///E:/%E9%A1%B9%E7%9B%AE/hyy-knowledgeBase-vue3/node_modules/.pnpm/registry.npmmirror.com+unplugin-vue-components@0.25.1_vue@3.3.4/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import Icons from "file:///E:/%E9%A1%B9%E7%9B%AE/hyy-knowledgeBase-vue3/node_modules/.pnpm/registry.npmmirror.com+unplugin-icons@0.16.5/node_modules/unplugin-icons/dist/vite.mjs";
import IconsResolver from "file:///E:/%E9%A1%B9%E7%9B%AE/hyy-knowledgeBase-vue3/node_modules/.pnpm/registry.npmmirror.com+unplugin-icons@0.16.5/node_modules/unplugin-icons/dist/resolver.mjs";
import { join } from "path";
var __vite_injected_original_dirname = "E:\\\u9879\u76EE\\hyy-knowledgeBase-vue3";
var vite_config_default = defineConfig({
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
    })
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
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxcdTk4NzlcdTc2RUVcXFxcaHl5LWtub3dsZWRnZUJhc2UtdnVlM1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcXHU5ODc5XHU3NkVFXFxcXGh5eS1rbm93bGVkZ2VCYXNlLXZ1ZTNcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6LyVFOSVBMSVCOSVFNyU5QiVBRS9oeXkta25vd2xlZGdlQmFzZS12dWUzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnXG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tICd1bnBsdWdpbi1pY29ucy9yZXNvbHZlcidcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgQXV0b0ltcG9ydCh7XG4gICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcigpLFxuICAgICAgICBJY29uc1Jlc29sdmVyKHtcbiAgICAgICAgICBwcmVmaXg6ICdJY29uJ1xuICAgICAgICB9KVxuICAgICAgXSxcbiAgICAgIGltcG9ydHM6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInLCAncGluaWEnXSxcbiAgICAgIGluY2x1ZGU6IFsvXFwuW3RqXXN4PyQvLCAvXFwudnVlXFw/Py9dLFxuICAgICAgZGlyczogWycuL3NyYy9jb21wb25lbnRzJywgJy4vc3JjL2hvb2tzJywgJy4vc3JjL3V0aWxzJywgJy4vc3JjL3JvdXRlcicsICcuL3NyYy9hcGknLCAnLi9zcmMvc3RvcmUnXSxcbiAgICAgIGR0czogJ3NyYy9hdXRvLWltcG9ydHMuZC50cydcbiAgICB9KSxcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIHJlc29sdmVyczogW1xuICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKCksXG4gICAgICAgIEljb25zUmVzb2x2ZXIoe1xuICAgICAgICAgIGVuYWJsZWRDb2xsZWN0aW9uczogWydlcCddXG4gICAgICAgIH0pXG4gICAgICBdXG4gICAgfSksXG4gICAgSWNvbnMoe1xuICAgICAgYXV0b0luc3RhbGw6IHRydWVcbiAgICB9KVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIHtcbiAgICAgICAgZmluZDogJ0AnLFxuICAgICAgICByZXBsYWNlbWVudDogam9pbihfX2Rpcm5hbWUsICdzcmMvJylcbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIGNzczoge1xuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIHNjc3M6IHtcbiAgICAgICAgYWRkaXRpb25hbERhdGE6IGBAaW1wb3J0IFwiLi9zcmMvc3R5bGUvc2Nzc0NvbmZpZy5zY3NzXCI7YFxuICAgICAgfVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFIsU0FBUyxvQkFBb0I7QUFDelQsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsMkJBQTJCO0FBQ3BDLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUMxQixTQUFTLFlBQVk7QUFQckIsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osV0FBVztBQUFBLE1BQ1QsV0FBVztBQUFBLFFBQ1Qsb0JBQW9CO0FBQUEsUUFDcEIsY0FBYztBQUFBLFVBQ1osUUFBUTtBQUFBLFFBQ1YsQ0FBQztBQUFBLE1BQ0g7QUFBQSxNQUNBLFNBQVMsQ0FBQyxPQUFPLGNBQWMsT0FBTztBQUFBLE1BQ3RDLFNBQVMsQ0FBQyxjQUFjLFVBQVU7QUFBQSxNQUNsQyxNQUFNLENBQUMsb0JBQW9CLGVBQWUsZUFBZSxnQkFBZ0IsYUFBYSxhQUFhO0FBQUEsTUFDbkcsS0FBSztBQUFBLElBQ1AsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsV0FBVztBQUFBLFFBQ1Qsb0JBQW9CO0FBQUEsUUFDcEIsY0FBYztBQUFBLFVBQ1osb0JBQW9CLENBQUMsSUFBSTtBQUFBLFFBQzNCLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxNQUFNO0FBQUEsTUFDSixhQUFhO0FBQUEsSUFDZixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0w7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxrQ0FBVyxNQUFNO0FBQUEsTUFDckM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gscUJBQXFCO0FBQUEsTUFDbkIsTUFBTTtBQUFBLFFBQ0osZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
