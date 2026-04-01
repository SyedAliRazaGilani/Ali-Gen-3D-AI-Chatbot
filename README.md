# AliGen-3D-AI-Chatbot

3D AI chatbot with an Avaturn avatar (GLB), lip-sync (Rhubarb cues → visemes), and animation clips.

## Repository layout

| Folder | App |
|--------|-----|
| **`AliGen-frontend`** | Vite + React + Three.js (browser UI) |
| **`AliGen-backend`** | Express BFF (`index.js`), `context/*.md`, `audios/` |

## Run locally

### Frontend (Vite)

```bash
cd AliGen-frontend
yarn install
yarn dev
```

### Backend (Express)

```bash
cd AliGen-backend
yarn install
yarn dev
```

Set `VITE_API_URL` in the frontend `.env` to your BFF origin (e.g. `http://localhost:3000`).

## Environment variables

**Express BFF** — `AliGen-backend/.env`:

- `PORT`
- `GROQ_API_KEY`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- (optional) `FRONTEND_URL`

**Vite client** — `AliGen-frontend/.env`:

- `VITE_API_URL`

## Renaming folders (swap)

If you still have the old reversed names, swap them in three steps:

```bash
# from repo root
mv AliGen-backend AliGen-frontend-tmp
mv AliGen-frontend AliGen-backend
mv AliGen-frontend-tmp AliGen-frontend
```

