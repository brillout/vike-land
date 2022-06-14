// vite.config.js
import path from 'path'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  server: {
    host: true
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        nested: path.resolve(__dirname, 'editor.html')
      }
    }
  }
}
export default config
