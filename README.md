# TalentAI — AI-Powered Job Portal

Full-stack job portal built with **Next.js 14**, **Tailwind CSS**, and **Google Gemini AI** (free).

## Features
- 🤖 AI Job Matching — scores every job against your profile
- 👥 AI Candidate Shortlisting — rank candidates instantly  
- 📝 AI Job Description Optimizer
- 📊 AI Market Intelligence — salary, trends, skills
- 🏢 Employer Dashboard
- 💼 Job Seeker Dashboard

## Quick Start

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/talentai.git
cd talentai
npm install
```

### 2. Add your FREE Gemini API key
```bash
cp .env.local.example .env.local
# Edit .env.local → add your key from https://aistudio.google.com
```

### 3. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. **Environment Variables** → Add:
   - Name: `GEMINI_API_KEY`
   - Value: your key from [aistudio.google.com](https://aistudio.google.com)
4. Deploy ✅

## Push to GitHub
```bash
git add .
git commit -m "Fix: use Gemini API, add error handling"
git push
```
Vercel auto-deploys on every push.

## Health check
Visit `/api/health` on your deployed URL to verify the AI is connected.
