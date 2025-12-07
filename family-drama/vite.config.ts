import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { ghPages } from 'vite-plugin-gh-pages'

const DEFAULT_REPO_BASE = '/family-drama/'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDeployMode = mode === 'pages' || process.env.GH_PAGES === 'true'
  const repoBase = process.env.VITE_GHPAGES_BASE ?? DEFAULT_REPO_BASE

  const plugins: PluginOption[] = [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ]

  if (isDeployMode) {
    plugins.push(ghPages())
  }

  return {
    base: isDeployMode ? repoBase : '/',
    plugins,
  }
})
