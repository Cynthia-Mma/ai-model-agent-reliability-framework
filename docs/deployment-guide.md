# Deployment Guide (Local & GitHub Pages)

## 1. Local Development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (default `http://localhost:5173`).

## 2. Run Automated Tests & Production Build

```bash
npm test
npm run build
npm run preview
```

## 3. Deploy to GitHub Pages

This project is pre-configured with `base: './'` in `vite.config.js` and hash-based navigation (`#/...`), ensuring all JavaScript chunks, stylesheets, charts, and `./resources/*` downloads resolve reliably on both root domains and repository subpaths (e.g. `https://<username>.github.io/ai-model-agent-reliability-framework/`).

### Option A: Automated GitHub Actions Deployment (Recommended)
1. Push the repository to GitHub on branch `main`.
2. In your GitHub repository, open **Settings -> Pages**.
3. Under **Build and deployment -> Source**, select **GitHub Actions**.
4. The included `.github/workflows/deploy.yml` workflow will automatically install dependencies, run `npm test`, build `dist/`, and publish to GitHub Pages on every push to `main`.

### Option B: Manual `gh-pages` Branch Deployment
```bash
npm run build
# Publish the contents of dist/ to the gh-pages branch
```
