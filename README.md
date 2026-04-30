# Persona Based Chatbot

This project demonstrates a persona based chatbot which provides three personas: Kshitij, Anshuman, or Abhimanyu. Made using Bun + Groq at backend and static HTML/CSS/JS at frontend.

**Deployed Link:** [link](https://champdeepak.github.io/personachatbot/)

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

Open the frontend, set Backend URL to your server and start chatting.

