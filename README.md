# Persona Based Chatbot

Ask Kshitij, Anshuman, or Abhimanyu anything. Made using Bun + Groq backend, static HTML/CSS/JS frontend.

**Live:** _add deployed link here_

## Setup

```bash
# backend
cd backend
cp .env.example .env   # fill in GROQ_API_KEY
bun install
bun run start          # http://localhost:3000

# frontend (any static server)
cd frontend
python3 -m http.server 5173
```

Open the frontend, set Backend URL to your server, ask away.

## Deploy

- **Frontend:** push `frontend/` to GitHub Pages or `vercel deploy frontend/`.
- **Backend:** any Bun host (Railway / Fly / Render). Set `GROQ_API_KEY` and `ALLOWED_ORIGIN`.
