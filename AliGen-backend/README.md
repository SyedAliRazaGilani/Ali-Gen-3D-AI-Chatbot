# AliGen API (Express)

Express server: `/chat`, `/projects`, `/blogs`, `/work`. Loads `context/portfolio.md`, `context/portfolio-llm.md`, and static audio under `audios/`.

## Setup

Create `.env` in this directory (repo folder name: **`AliGen-backend`**):

- `PORT` — e.g. `3000`
- `GROQ_API_KEY`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` (Polly + optional FFmpeg/Rhubarb for typed replies)

```bash
yarn install
yarn dev
```

The Vite UI lives in **`../AliGen-frontend`** and should set `VITE_API_URL` to this server’s URL.
