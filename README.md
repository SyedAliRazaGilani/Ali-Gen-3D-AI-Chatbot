# AliGen-3D-AI-Chatbot

3D AI chatbot with an Avaturn avatar (GLB), lip-sync (Rhubarb cues → visemes), and animation clips.

## Run locally

### Frontend (Vite)

```bash
cd AliGen-backend
yarn install
yarn dev
```

### Backend (Express)

```bash
cd AliGen-frontend
yarn install
yarn dev
```

## Environment variables

Backend expects (set in `AliGen-frontend/.env`):

- `PORT`
- `GROQ_API_KEY`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- (optional) `FRONTEND_URL`

Frontend expects (set in `AliGen-backend/.env`):

- `VITE_API_URL`

