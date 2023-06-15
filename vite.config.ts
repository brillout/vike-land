// vite.config.js
import path from 'path'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  server: {
    host: true,
    port: 3000
  },
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        editor: path.resolve(__dirname, 'editor.html'),
        embed: path.resolve(__dirname, 'embed.html')
      }
    }
  }
}
export default config
