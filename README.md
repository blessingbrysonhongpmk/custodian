# 🌳 TreeGuard

### Every tree has a caretaker. Every caretaker has a successor.

> *No tree left behind.*

---

## The Problem

Tree survival doesn't fail because of bad planting — it fails because **responsibility disappears**.

- Students graduate
- Volunteers relocate  
- NGO projects end
- CSR funding cycles close
- Community members stop participating

Existing platforms ask: *"Is the tree alive?"*

**TreeGuard asks: *"Who is responsible if it isn't — and does that responsibility ever lapse?"***

---

## The Solution

TreeGuard is an **AI-assisted custody continuity platform** that ensures every planted tree always has an accountable caretaker.

When custody is about to expire, TreeGuard:
1. **Detects** the approaching expiry
2. **Matches** the best successor candidate using a scoring algorithm
3. **Transfers** responsibility through a digital handoff ceremony
4. **Verifies** tree health using Gemini AI photo analysis
5. **Escalates** to institutional anchors if no successor accepts

**A tree can lose a caretaker. It should never lose accountability.**

---

## Features

| Feature | Description |
|---------|-------------|
| 🌱 **Tree Passport** | Complete digital identity with QR code, GPS, custody chain, and health timeline |
| 🔗 **Custody Chain** | Persistent history of every custodian who cared for a tree |
| ⏰ **Custody Expiry Engine** | Automatic detection of expiring custody with status transitions |
| 🤝 **Successor Matching** | AI-scored candidate recommendations (distance, reliability, availability) |
| 🔄 **Custody Handoff** | Digital ceremony with pledge acceptance and certificate generation |
| 🏛️ **Institutional Anchor** | Trees always belong to an institution — never fully orphaned |
| 🤖 **AI Verification** | Gemini-powered photo analysis with confidence scoring |
| 📍 **GPS Verification** | Haversine distance check between checkpoint and tree location |
| 🔴 **Risk Center** | Real-time risk events with severity-based prioritization |
| 📊 **Impact Dashboard** | Computed metrics from real data (not hardcoded) |
| 📱 **Notification Center** | In-app + simulated SMS/WhatsApp alerts |
| ⏳ **Demo Time Machine** | Simulate time progression for hackathon demos |
| 🏥 **Failure Autopsy** | Learn from tree deaths — classify causes, document lessons |
| 📋 **Orphan Risk Score** | Predictive scoring for trees at risk of losing their custodian |

---

## Architecture

```
         TREEGUARD
             │
 ┌───────────┼───────────┐
 │           │           │
 ▼           ▼           ▼
REACT      SUPABASE    GEMINI AI
FRONTEND   TypeScript    Google AI
           Backend
             │
             │ PostgreSQL
             │ Authentication
             │ Storage
             │ Realtime
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm
- PostgreSQL (or Docker)

### 1. Clone & Install

```bash
git clone https://github.com/blessingbrysonhongpmk/custodian
cd custodian
pnpm install
```

```bash
# Setup Supabase (use standard Supabase dashboard)
1. Create a Supabase project
2. Run SQL scripts from `supabase/migrations/`
3. Get your API keys and connection strings

# Database Schema & Data Migration
Supabase handles the core DB. Existing local Express API backend is retained purely to proxy Gemini requests securely.
```

### 3. Environment Variables

```bash
cp .env.example .env
# Edit .env and set:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# GEMINI_API_KEY= (optional — app works without it in demo mode)
```

### 4. Run

```bash
# Frontend only (demo data)
pnpm run dev

# Frontend + API server
pnpm run dev:all
```

- Frontend: http://localhost:3000
- API: http://localhost:5001

---

## Demo Mode

The app works **without** a database or Gemini API key:
- **No database**: Falls back to built-in demo data
- **No Gemini key**: Uses simulated AI analysis with a "Demo Mode" badge
- **Simulated notifications**: SMS and WhatsApp delivery is simulated

### Demo Time Machine (Admin Only)
Simulate time progression to demonstrate custody expiry:
- Today → +30 days → +60 days → +90 days
- Graduation Event → Custodian Inactive → Missed Checkpoint

### 3-Minute Judge Demo
Built-in guided demo walkthrough:
1. 500 trees planted — healthy system
2. Student graduating — custody expiring in 14 days
3. Successor matching activated
4. Priya accepts responsibility
5. Failure autopsy — learning from loss
6. Custody gap prevented — "No tree left behind"

---

## Production Roadmap

- [ ] Real SMS integration (MSG91 / Twilio)
- [ ] WhatsApp Business API
- [ ] Municipal tree registry API integration
- [ ] Large-scale GIS mapping
- [ ] Mobile app (React Native)
- [ ] Multi-language support (Hindi, Tamil, Malayalam, Kannada)

---

## Team

Built at the TreeGuard Hackathon 2026.

---

**TREEGUARD** — *Tracking a tree is not enough. Responsibility must survive.*
