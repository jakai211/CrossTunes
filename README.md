# CrossTunes

CrossTunes is a web application developed as a college project that enables users to cross-reference and match playlists across different music streaming platforms. It helps users discover equivalent tracks, recreate playlists, and bridge the gap between services like Spotify and more.

## Active app

Use the app in `frontend/` at the repository root. That is the current frontend and includes the newer music search and Spotify connection flow.

The nested `CrossTunes/frontend/` app is an older copy and should be treated as legacy unless you intentionally want that version.

## First-time setup

Install dependencies once after cloning:

```bash
npm install --prefix frontend
npm install --prefix backend
```

Optional backend environment file:

```bash
copy backend\.env.example backend\.env
```

The backend now defaults to port `3000` even without `.env`. Spotify, YouTube, SoundCloud, and MySQL settings are only needed if you want those integrations enabled.

## Run the updated frontend

From the repository root:

```bash
npm run frontend:dev
```

To build the updated frontend:

```bash
npm run frontend:build
```

To start the backend:

```bash
npm run backend:start
```

## Local auth fallback

If MySQL is unavailable, the backend now falls back to local JSON storage for account login/register data and Spotify connection state.

That fallback data is written under `backend/.local-data/` so you can keep using the app while your database server is offline.
