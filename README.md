# TalentAI — AI-Powered Job Portal

A full-stack job portal built with **Next.js 14**, **Tailwind CSS**, and **Claude AI** (Anthropic). Features AI job matching for seekers, AI candidate shortlisting for employers, and live market intelligence.

## Features

- 🤖 **AI Job Matching** — Scores every job against your profile (skills, experience, location, preference)
- 👥 **AI Candidate Shortlisting** — Employers get ranked candidates with AI evaluation in seconds
- 📝 **AI Job Description Optimizer** — Generates polished JDs from bullet-point inputs
- 📊 **AI Market Intelligence** — Real-time insights on salary, trends, and in-demand skills
- 🏢 **Employer Dashboard** — Post jobs, find candidates, schedule interviews
- 💼 **Job Seeker Dashboard** — Profile builder, match feed, application tracker

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| AI | Anthropic Claude (claude-sonnet-4) |
| Deployment | Vercel |

## Getting Started Locally

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/talentai.git
cd talentai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add your API key
```bash
cp .env.local.example .env.local
# Edit .env.local and add your Anthropic API key
# Get one free at https://console.anthropic.com
```

### 4. Run the dev server
```bash
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel (Free)

### Option A — Vercel Dashboard (Recommended)
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → "Add New Project"
3. Import your GitHub repo
4. Under **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` = your key from [console.anthropic.com](https://console.anthropic.com)
5. Click **Deploy** ✅

### Option B — Vercel CLI
```bash
npm i -g vercel
vercel
# Follow prompts, then add env var in Vercel dashboard
```

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — TalentAI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/talentai.git
git push -u origin main
```

## Project Structure

```
talentai/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page
│   │   ├── jobs/page.tsx         # Job seeker — AI matches
│   │   ├── employer/page.tsx     # Employer dashboard
│   │   ├── insights/page.tsx     # AI market intelligence
│   │   ├── api/chat/route.ts     # All AI API calls (server-side)
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                   # MatchRing, AIBox, Avatar, LiveBadge
│   │   └── layout/               # Navbar, Footer
│   └── lib/
│       └── types.ts              # TypeScript interfaces
├── .env.local.example
├── tailwind.config.js
├── next.config.js
└── package.json
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (required) |

## License
MIT
