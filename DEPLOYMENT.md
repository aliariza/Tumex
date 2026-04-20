# Deployment

## Backend on Heroku

Deploy the `/backend` app to Heroku and set these config vars:

```sh
MONGO_URI=your-mongodb-connection-string
TOKEN_SECRET=use-the-existing-value-from-backend/.env
FRONTEND_URL=https://www.tum-ex.com,https://tum-ex.com
FRONTEND_URL_REGEX=^https://.*\.vercel\.app$
```

Notes:

- `FRONTEND_URL` accepts a comma-separated list if you want to allow multiple fixed domains.
- `FRONTEND_URL_REGEX` is optional and is useful for Vercel preview deployments.
- Heroku will provide `PORT` automatically.
- Your Heroku app remote is already set to `tumex-backend`, so the API base URL is expected to be `https://tumex-backend.herokuapp.com`.
- The process entrypoint is `web: npm start` from [backend/Procfile](/Users/alitumay/Desktop/TumexVue_Version_1.4.0/backend/Procfile:1).

## Frontend on Vercel

Deploy the `/frontend` app to Vercel with:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Set this environment variable in Vercel:

```sh
VITE_API_BASE_URL=https://tumex-backend.herokuapp.com
```

Routing for Vue history mode is handled by [frontend/vercel.json](/Users/alitumay/Desktop/TumexVue_Version_1.4.0/frontend/vercel.json:1).

Recommended production domain:

```sh
https://www.tum-ex.com
```

If Vercel also serves the project on its default `*.vercel.app` domain, keep `FRONTEND_URL_REGEX` enabled in Heroku so preview and branch deployments can still reach the API.

## Local env files

- Copy [backend/.env.example](/Users/alitumay/Desktop/TumexVue_Version_1.4.0/backend/.env.example:1) to `backend/.env`
- Copy [frontend/.env.example](/Users/alitumay/Desktop/TumexVue_Version_1.4.0/frontend/.env.example:1) to `frontend/.env`
