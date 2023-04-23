import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { vitePluginBuildInfo } from 'vite-plugin-build-info'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  base: './',
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: true,
      vueTemplate: true,
    }),
    Components({
      dts: true,
      directoryAsNamespace: true,
    }),
    vitePluginBuildInfo({
      shortSha: true,
    }),
  ],
})
