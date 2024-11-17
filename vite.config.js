import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';
import {resolve} from "path";
import IconsResolver from "unplugin-icons/resolver"
import Icons from "unplugin-icons/vite"

export default defineConfig({
    server: {
        // https: true,
        proxy: {
            '/api': {
                target: 'http://118.178.138.32:8010',
                changeOrigin: true,
                ws: true,
                rewrite: path => path.replace(/^\/api/, '')
            }
        }
    },
    plugins: [
        vue(),
        Components({
            resolvers: [
                // 自动注册图标组件
                IconsResolver({
                    enabledCollections: ['ep'],
                }),
                ElementPlusResolver(), // 自动导入 Element Plus
            ],
        }),
        AutoImport({
            imports: ['vue'],  // 自动导入 Vue API，比如 ref, reactive 等
            resolvers: [
                ElementPlusResolver(),// 自动导入 Element Plus
                // 自动导入图标组件
                IconsResolver({
                    prefix: 'Icon',
                }),
            ],
        }),
        Icons({
            autoInstall: true,
            compiler: 'vue3'
        })
    ],
    resolve: {
        alias: [
            {
                find: '@',
                replacement: resolve(__dirname, './src')
            }
        ]
    },
    css: {
        preprocessorOptions: {
            scss: { // 解决scss 报警
                api: "modern-compiler" // or 'modern'
            }
        }
    },
});
