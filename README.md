<div align="center">

![AliGen — 3D portfolio assistant & technology stack](AliGen-frontend/src/assets/technologies-face-card.png)

# AliGen — 3D AI Portfolio Assistant

**Interactive 3D avatar** that speaks, lip-syncs, and answers visitors about Ali Gilani’s work — powered by **React Three Fiber**, **Groq**, and **Amazon Polly**.

[**View demo**](https://aligilani.com) · [**GitHub**](https://github.com/SyedAliRazaGilani)

*Replace the demo URL above if your deployed AliGen instance lives elsewhere.*

</div>

---

## 🎯 Overview

AliGen is a portfolio experience that combines a **glTF avatar** (Avaturn-style mesh with viseme morph targets), **pre-authored voice clips** for nav actions, and **LLM-generated replies** for free-text chat. Visitors can explore **About**, **Work**, **Hobbies**, **Projects**, and **Blogs** through UI panels fed by markdown context, while the assistant stays grounded in a **slim `portfolio-llm.md`** file to limit token use.

---

## ✨ Features

- **🧑‍💻 3D avatar** — `@react-three/fiber`, `@react-three/drei`, custom animations and facial / viseme morphing for lip-sync
- **🎙️ Voice & lip-sync** — Static **WAV + JSON (Rhubarb-style cues)** for template buttons; **Polly + optional Rhubarb** for typed chat replies
- **💬 Chat** — **Groq** (`llama-3.1-8b-instant`) with JSON-structured responses (text, expression, animation)
- **📇 Portfolio UI** — Projects, blogs, and work experience from **`AliGen-backend/context/portfolio.md`**; LLM uses **`portfolio-llm.md`** only
- **🎨 Modern UI** — Tailwind, glass-style panels, dark mode, responsive layout
- **🔗 Integrations** — Chess.com profile card, Steam profile, Spotify podcast card, links to GitHub projects

---

## 🏗️ Architecture

| Layer | Role |
|--------|------|
| **`AliGen-frontend`** | Vite + React SPA, Three.js scene, calls BFF via `VITE_API_URL` |
| **`AliGen-backend`** | Express BFF: `/chat`, `/projects`, `/blogs`, `/work`, static audio, Polly + FFmpeg/Rhubarb pipeline |

Template button clicks return **canned audio + lipsync** (no Groq/Polly for those turns). Typed messages hit **Groq** then **Polly** for TTS.

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Three.js, R3F, Drei, Tailwind, Leva (dev), GSAP / Motion  
**Backend:** Node.js, Express, Groq SDK, AWS Polly, `fluent-ffmpeg` (optional lip-sync pipeline)  
**Assets:** GLB models, animation clips, curated `audios/*.wav` + `*.json` lipsync data  
**Content:** Markdown context under `AliGen-backend/context/`

---

## 📁 Repository Layout

| Folder | App |
|--------|-----|
| **`AliGen-frontend`** | Vite + React + Three.js (browser UI) |
| **`AliGen-backend`** | Express BFF (`index.js`), `context/*.md`, `audios/` |

---

## 🚀 Run Locally

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

Set **`VITE_API_URL`** in `AliGen-frontend/.env` to your BFF origin (e.g. `http://localhost:3000`).

---

## 🔐 Environment Variables

**Express BFF** — `AliGen-backend/.env`:

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP port for the API |
| `GROQ_API_KEY` | Groq chat completions |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` | Amazon Polly (and AWS usage if applicable) |
| `FRONTEND_URL` | Optional CORS / deployment hint |

**Vite client** — `AliGen-frontend/.env`:

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Base URL of the Express BFF |
| `VITE_CSGO_PROFILE_URL` | Optional override for Steam profile link (gaming card) |

---

## 🎵 Audio & Lip-Sync

- **Nav templates** (About, Work, Hobbies, Projects, Blogs, errors): read from **`AliGen-backend/audios/`** as base64 WAV + JSON mouth cues.
- **Typed chat**: Polly synthesizes MP3; optional Rhubarb step produces per-message JSON (see `index.js`).

---

## 🤖 LLM & Token Discipline

- Chat prompts inject **`context/portfolio-llm.md`** only — **not** the full site markdown.
- **`portfolio.md`** powers `/projects`, `/blogs`, `/work` and the rich UI panels.
- Chat history is capped server-side to keep prompts small.

---

## ☁️ Deploy Notes

### Frontend (e.g. Render)

Set service **root** to `AliGen-frontend`, build `yarn install && yarn build`, publish `dist`. See `AliGen-frontend/render.yaml`.

### Frontend on Vercel

- **Root Directory:** `AliGen-frontend`
- **Framework:** Vite (or Other + output `dist`)
- **Node:** `package.json` sets `"engines": { "node": "24.x" }` for current Vercel defaults ([Vercel Node support](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)).
- **Build:** `corepack enable && yarn install && yarn build` — prefer **without** `--immutable` on Vercel unless you need strict lockfile CI (immutable often fails when the platform’s install cache differs slightly).
- **Env:** `VITE_API_URL` = your Railway API origin (no trailing slash).
- **Railway CORS:** set `FRONTEND_URL` on the BFF to your Vercel URL after the first deploy.

### Backend on Railway (Express BFF)

These steps deploy **`AliGen-backend`** only (the API that serves `/chat`, `/projects`, `/blogs`, `/work`).

1. **Create a Railway project**  
   In [Railway](https://railway.app), **New Project** → **Deploy from GitHub** → select this repository.

2. **Monorepo: backend lives in `AliGen-backend/`**  
   **Option A — no “Root directory” in the UI:** this repo includes **`railway.toml` at the repository root**. It sets `buildCommand` and `startCommand` to `cd AliGen-backend && …`, so Railway builds from the repo root but installs and runs the Express app in **`AliGen-backend`**. Clear any custom build/start overrides in the dashboard so the file is used (config in the repo overrides empty dashboard fields; if you set commands in the UI, they can override the file — remove duplicates).  

   **Option B — Root directory in the UI:** open the **service** (click the service on the project canvas) → **Settings** → scroll to **Root directory** (sometimes under **Source** or **Build**). Set it to **`AliGen-backend`**. Then you can use **`AliGen-backend/nixpacks.toml`** and start command **`yarn start`** only. If you still don’t see Root directory, use Option A.

3. **Build & start (summary)**  
   - **With root `railway.toml`:** install = `npm install -g corepack && corepack enable && cd AliGen-backend && yarn install`; start = `cd AliGen-backend && yarn start`.  
   - **With Root directory = `AliGen-backend`:** leave dashboard build/start empty and rely on **`AliGen-backend/nixpacks.toml`**, or use:  
     `npm install -g corepack && corepack enable && yarn install` and **`yarn start`**.  

   Railway sets **`PORT`** automatically. Do **not** use `apt-get` / `init.sh` here.

   Per [Railway monorepo docs](https://docs.railway.com/guides/monorepo), config-as-code paths are from the **repo root** unless you use per-package `railway.toml` inside **`AliGen-backend/`** together with Root directory.

4. **Environment variables** (service → **Variables**)

   | Variable | Required | Notes |
   |----------|----------|--------|
   | `PORT` | No | Set by Railway; do not override unless you know you need to. |
   | `GROQ_API_KEY` | Yes | Groq API key for typed chat. |
   | `AWS_ACCESS_KEY_ID` | Yes* | Amazon Polly for TTS on typed replies. |
   | `AWS_SECRET_ACCESS_KEY` | Yes* | |
   | `AWS_REGION` | Yes* | e.g. `us-east-1` |
   | `FRONTEND_URL` | **Recommended** | Your deployed Vite site origin, e.g. `https://your-app.onrender.com` — used for **CORS**. Using your real frontend URL avoids issues with `credentials: true` in the browser. If unset, the server falls back to `*` (ok for quick tests, not ideal for production). |

   \*Required if you want **voice on free-typed messages**. Template button responses use files under `audios/` and do not call Polly.

5. **Deploy & get the URL**  
   After deploy, open **Settings → Networking → Generate Domain** (or attach a custom domain). Copy the public URL (e.g. `https://your-service.up.railway.app`).

6. **Point the frontend at Railway**  
   In **`AliGen-frontend/.env`** (or your host’s env UI), set:

   ```bash
   VITE_API_URL=https://your-service.up.railway.app
   ```

   Rebuild/redeploy the frontend so the browser calls the Railway BFF.

7. **FFmpeg / Rhubarb (optional)**  
   The BFF can run **FFmpeg** and **Rhubarb** for lip-sync on Polly-generated audio. The default Railway Node image may **not** include those binaries. If lip-sync fails in logs, typed chat may still return audio with `lipsync: null`. To enable Rhubarb on Railway you’d add a **Dockerfile** or **Nixpacks** config that installs them — not required for a first deploy.

8. **Health check**  
   There is no dedicated `/health` route yet; Railway can use the default **TCP** check on `PORT` or hit `GET /projects` once the service is up.

---

## 📜 Optional: Folder Name Swap

If you ever clone an old fork with reversed folder names:

```bash
mv AliGen-backend AliGen-frontend-tmp
mv AliGen-frontend AliGen-backend
mv AliGen-frontend-tmp AliGen-frontend
```

If **`AliGen-frontend`** already contains Vite and **`AliGen-backend`** contains `index.js`, skip this.

---

## 🙏 Credits

- **3D / React Three** — [pmndrs](https://github.com/pmndrs) ecosystem  
- **Lip-sync cues** — [Rhubarb Lip Sync](https://github.com/DanielSWolf/rhubarb-lip-sync) (or compatible JSON format)  
- **AliGen** — portfolio assistant for **Ali Gilani**

---

<p align="center">
  <b>AliGen</b> — 3D AI portfolio chatbot · <a href="https://aligilani.com">aligilani.com</a>
</p>
