# Family Drama Eliminator

A tiny React + Vite game where you explode floating heads until the family drama ends. Built with TypeScript, React Compiler, and a celebratory win overlay (party poppers included).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR. |
| `npm run build` | Type-check and build for production (no deploy side-effects). |
| `npm run preview` | Preview the latest production build locally. |
| `npm run lint` | Run ESLint across the repo. |
| `npm run deploy` | Type-check, build with the GitHub Pages base, and publish via `vite-plugin-gh-pages`. |

## Deploying to GitHub Pages

This project uses [`vite-plugin-gh-pages`](https://github.com/metonym/vite-plugin-gh-pages). Deployment happens when Vite runs in `pages` mode (triggered by `npm run deploy`).

1. Authenticate with GitHub (e.g., `gh auth login`) so the plugin can push to the `gh-pages` branch.
2. (Optional) Override the default base path (`/family-drama/`) by setting `VITE_GHPAGES_BASE`:

   ```bash
   VITE_GHPAGES_BASE=/your-repo-name/ npm run deploy
   ```

3. Run `npm run deploy`. This executes `tsc -b && vite build --mode pages`, adds the plugin during that build, and publishes `dist` to `gh-pages`.
4. In your repository settings, point GitHub Pages to the `gh-pages` branch (`/` root).

Local builds (`npm run build`) keep the base path at `/`, so you can continue to preview the app from the project root without the GitHub Pages prefix.