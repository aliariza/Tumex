# Deployment

## Backend on Heroku

Deploy the `/backend` app to Heroku and set these config vars:

```sh
MONGO_URI=your-mongodb-connection-string
TOKEN_SECRET=use-the-existing-value-from-backend/.env
FRONTEND_URL=https://www.tum-ex.com,https://tum-ex.com
FRONTEND_URL_REGEX=^https://.*\.vercel\.app$
ACCESS_REQUEST_EMAIL=artumay@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=your-gmail-address@gmail.com
```

Notes:

- `FRONTEND_URL` accepts a comma-separated list if you want to allow multiple fixed domains.
- `FRONTEND_URL_REGEX` is optional and is useful for Vercel preview deployments.
- `ACCESS_REQUEST_EMAIL` is where new bayi access requests are sent.
- The SMTP values are required if you want registration requests to send email notifications.
- For Gmail, use an App Password, not your normal account password.
- Heroku will provide `PORT` automatically.
- Your Heroku app remote is already set to `tumex-backend`, so the API base URL is expected to be `https://tumex-backend.herokuapp.com`.
- The process entrypoint is `web: npm start` from [backend/Procfile](/Users/alitumay/Desktop/TumexVue_Version_1.4.0/backend/Procfile:1).

### Dealer approval flow

The app now uses 3 access levels:

- `user`: public only, pending approval for bayi access
- `dealer`: public + bayi protected pages
- `admin`: public + bayi + admin

New registrations are created as `user`. When someone registers:

1. The backend stores them with role `user`
2. The backend emails `ACCESS_REQUEST_EMAIL`
3. They cannot log into bayi pages yet
4. An admin must open `/admin/users` and change their role to `dealer` or `admin`

After approval, the user can log in and access the correct pages for their role.

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

## First admin approval

Once deployed:

1. Register a test user from the bayi page
2. Confirm the access request email arrives at `artumay@gmail.com`
3. Log into `/admin`
4. Open `/admin/users`
5. Change that user from `Public` to `Bayi`
6. Log in with that user and confirm `/protected` loads
