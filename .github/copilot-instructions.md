# Copilot instructions

Call-for-speakers form for Latino .NET Online: a React 19 + TypeScript SPA built with Vite and managed with pnpm (lockfile `pnpm-lock.yaml`; dependency build scripts are denied in `pnpm-workspace.yaml`), deployed to GitHub Pages. (`README.md` is leftover Create React App boilerplate and is outdated.)

## Commands

- `pnpm start` – Vite dev server on http://localhost:3000 (port matters: the dev OIDC redirect URIs in `src/config/env.json` use it)
- `pnpm run build` – `tsc --noEmit && vite build`, output in `build/`. The type check is the only lint/static check; there is no ESLint.
- `pnpm test` – `vitest run --passWithNoTests` (jsdom). There are currently no tests. Run one file with `pnpm exec vitest run path/to/file.test.tsx`, or one test with `-t "name"`.
- `pnpm run api` – regenerates the axios client in `src/generated-sources/openapi` from `docs/openapi.json` (openapi-generator-cli 6.0.1, needs Java). Generated code is committed; never edit it by hand.

## Architecture

- **Auth:** `oidc-react` `AuthProvider` in `src/App.tsx` against `https://ids.latinonet.online` (code flow). Routes: `/`, `/callback`, `/thank-you`, `/signout-redirect`. The router `basename` is `import.meta.env.BASE_URL`.
- **State:** a hand-rolled Redux-like store, not a library. `src/data/state.ts` combines slice reducers (`callForSpeakers`, `speakers`) via `combineReducers.ts`; `AppContext.tsx` exposes `useAppContext()` returning `{ state, dispatch }`.
- **Actions:** each slice has `*.action.ts` (action creators, plus a `...Actions` union type), `*.reducer.ts`, `*.state.ts` and `*.api.ts`. `dispatch` is wrapped by `wrapAsync.ts`, so it accepts either a plain action object or a thunk `(dispatch) => Promise<action|void>`. Async actions dispatch other actions internally (e.g. `setLoading`).
- **API layer:** `src/services/apiClient.ts` creates one axios instance (adds the Bearer token from `sessionStorage["access_token"]`; error interceptor rejects with `error.response`) and builds `ProposalsApi`/`SpeakersApi`/`ImagesApi` from the generated client. `*.api.ts` files call these and map DTOs to UI models in `src/models` through adapter functions (e.g. `adapterSpeaker`).
- **UI:** `pages/CallForSpeakersPage` is a multi-step wizard; step content lives in `components/sections`, reusable fields in `components/inputs`.

## Conventions

- **Deployment config:** the workflow (`.github/workflows/build-and-deploy.yml`) overwrites `src/config/env.json` values and `package.json` `homepage` with `microsoft/variable-substitution`. `vite.config.ts` derives Vite's `base` from `homepage`, so keep the `homepage` key in `package.json` and keep `env.json` keys flat. Read config through `src/config/EnvConfig.ts`, not `import.meta.env`.
- Use `import.meta.env.BASE_URL` (not `process.env.PUBLIC_URL`) for the base path.
- Static assets referenced by path live in `public/`; `index.html` is at the repo root (Vite).
- Styling is plain SCSS files next to components, imported globally.
