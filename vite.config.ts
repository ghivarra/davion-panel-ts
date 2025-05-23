import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'

/* global process */

const env = loadEnv('', process.cwd());

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    basicSsl()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./resources', import.meta.url))
    }
  },
  css: {
    postcss: './postcss.config.js'
  },
  build: {
    emptyOutDir: false,
    copyPublicDir: false,
    outDir: 'public',
    assetsDir: env.VITE_ASSETS_DIR,
    manifest: true,
    rollupOptions: {
      input: `./${env.VITE_RESOURCES_DIR}/${env.VITE_ENTRY_FILE}`,
      output: {
					manualChunks: (id): string | undefined => {

						// the first order executed first so make sure the dependency from the packages is
						// chunked first to prevent uncaught reference error after bundled
						const chunkedFiles = [
							'fortawesome', // chunk big icons packages
							'node_modules', // chunk all another dependency packages,
							'resources/libraries', // chunk all custom library packages
						];

						// debug all libs needed
						// console.log(id)

						for (let i = 0; i < chunkedFiles.length; i++) {
							const chunked = chunkedFiles[i];
							if (id.includes(chunked)) {
								return 'chunk-' + chunked
							}
						}

						return undefined
					}
				}
    },
  },
  server: {
    origin: env.VITE_ORIGIN,
    port: parseInt(env.VITE_PORT),
    strictPort: true,
    cors: true,
    hmr: {
      host: env.VITE_HOST,
      port: parseInt(env.VITE_PORT),
      protocol: 'wss'
  }
  }
})
