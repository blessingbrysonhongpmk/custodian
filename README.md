# 🌳 Vanam Kuri

**Vanam Kuri** is an open, trust-verifiable community tree custodianship and urban/rural forestry tracking platform. It enables communities, custodians, and environmental groups to plant, monitor, verify, and maintain tree health with cryptographic checkpoints, custody history, and mutual-aid payouts.

---

## ⚡ Quick Start

### Prerequisites
- **Node.js**: `v20.0.0` or higher (Node 24 recommended)
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Run Development Server
```bash
# Start the frontend application (http://localhost:5173)
npm run dev

# Or start both frontend and backend API concurrently
npm run dev:all
```

---

## 🛠 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Runs the Vanam Kuri frontend application via Vite |
| `npm run dev:api` | Runs the Express API backend server (port 5000) |
| `npm run dev:all` | Runs both Frontend and Backend concurrently |
| `npm run dev:mockup` | Runs the UI Prototyping Sandbox |
| `npm run build` | Builds the frontend and backend for production |
| `npm run typecheck` | Validates TypeScript across all packages |

---

## 🏗 Project Architecture

This repository is organized as a clean, modular workspace:

```
├── artifacts/
│   ├── vanam-kuri/          # Core React frontend application (Vite + TailwindCSS + Lucide)
│   ├── api-server/          # Express API server with pino logging and health checks
│   └── mockup-sandbox/      # UI design and prototyping sandbox
├── lib/
│   ├── db/                  # Database schema and Drizzle ORM models
│   ├── api-zod/             # Zod validation schemas
│   ├── api-client-react/    # TanStack React Query client hooks
│   └── api-spec/            # OpenAPI specification & codegen
├── scripts/                 # Cross-platform runner and build scripts
├── Dockerfile               # Container deployment configuration
├── docker-compose.yml       # Docker compose setup
├── vercel.json              # Vercel deployment configuration
└── netlify.toml             # Netlify deployment configuration
```

---

## 🚀 Hosting & Deployment Guide

### Option 1: Vercel (Frontend)
1. Import this repository into [Vercel](https://vercel.com).
2. **Framework Preset**: `Vite`
3. **Root Directory**: `artifacts/vanam-kuri`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`

### Option 2: Netlify (Frontend)
1. Connect repository in [Netlify](https://netlify.com).
2. **Base directory**: `artifacts/vanam-kuri`
3. **Build command**: `npm run build`
4. **Publish directory**: `dist`

### Option 3: Docker / Container (Full-stack)
Build and run the entire application using Docker:
```bash
docker-compose up --build
```

### Option 4: Render / Railway / Cloud VPS
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run dev:api` (or custom server runner)
- Set Environment Variables:
  - `PORT`: (provided by host or defaults to 5000)
  - `DATABASE_URL`: `postgres://user:password@host:5432/vanamkuri`

---

## 🔐 Environment Variables

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Optional | `5173` (web) / `5000` (api) | HTTP Server Port |
| `DATABASE_URL` | Optional | — | PostgreSQL connection string |
| `BASE_PATH` | Optional | `/` | Base URL path for web deployment |

---

## 📜 License
MIT License
