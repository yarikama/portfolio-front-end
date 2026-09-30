# Portfolio Front-End

[![CI](https://github.com/yarikama/portfolio-front-end/actions/workflows/ci.yml/badge.svg)](https://github.com/yarikama/portfolio-front-end/actions/workflows/ci.yml)

The website at [yarikama.com](https://www.yarikama.com): React 19, TypeScript, Vite and Tailwind CSS v4, deployed on Vercel. The API is [portfolio-back-end](https://github.com/yarikama/portfolio-back-end).

- **Works and notes**: projects and Markdown notes (with KaTeX math) from the API.
- **Ask about my work**: a chat that streams answers, with numbered sources, from a language model self-hosted on a home server. Visitors can also highlight any passage on the site and ask about it.
- **Admin**: an editor for notes and projects, with inline autocomplete from a second self-hosted model.

## Development

```bash
npm ci
cp .env.example .env   # VITE_API_BASE_URL: the API to use (a local backend by default)
npm run dev
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run lint` | ESLint, with no warnings allowed |
| `npm test` | Vitest: the answer stream parser, citation links, image variants |
| `npm run build` | Type-check with `tsc`, then build into `dist/` |

CI (GitHub Actions) runs lint, tests and the build on every pull request and every push to `main`.
