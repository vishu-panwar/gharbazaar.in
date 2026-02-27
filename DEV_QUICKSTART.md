# 🚀 Quick Start Guide - Development Mode

[← Back to README](README.md) | [📊 Database Setup](DATABASE_SETUP_SUCCESS.md) | [📋 Stability Report](DEVELOPMENT_STABILITY_REPORT.md)

## Prerequisites
- ✅ Node.js v18+ installed
- ✅ Docker installed (for PostgreSQL)

---

## 🐳 Start PostgreSQL (Docker)

**Automated Setup (Recommended):**
```powershell
# Run the setup script (handles Docker startup, container creation, migrations)
.\setup-database.ps1
```

**Manual Setup:**
```bash
# Ensure Docker Desktop is running first!
# Then start PostgreSQL container
docker-compose up -d

# Wait for database to be ready (10 seconds)
Start-Sleep -Seconds 10

# Run database migrations
cd backend
npx prisma migrate dev
```

**Verify PostgreSQL is running:**
```bash
# Check container status
docker ps | Select-String gharbazaar-postgres

# Or use Docker Desktop GUI
```

**Stop PostgreSQL (when done):**
```bash
docker-compose down
```

---

## 🏃 Start Development Servers

### Terminal 1 - Backend Server
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```
**✅ Backend running at:** http://localhost:5001

### Terminal 2 - Frontend Server
```bash
cd frontend
npm install
npm run dev
```
**✅ Frontend running at:** http://localhost:3000

---

## 🛠️ Common Commands

### Backend
```bash
# Start development server (hot reload)
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Frontend
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking only
npx tsc --noEmit
```

---

## 🔍 Testing the Setup

### 1. Test Backend Health
```bash
curl http://localhost:5001/api/v1/health
```
**Expected:** `{"success":true,"message":"API is healthy"}`

### 2. Test Frontend
Open browser: http://localhost:3000

### 3. Test Database Connection
```bash
cd backend
npx prisma studio
```
**Expected:** Opens Prisma Studio at http://localhost:5555

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5001 is in use
netstat -ano | findstr :5001

# Clear dist folder and rebuild
rm -rf dist
npm run build
```

### Frontend won't start
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Database connection error
```bash
# Check if PostgreSQL container is running
docker ps | Select-String gharbazaar-postgres

# If not running, start it
docker-compose up -d

# Check logs
docker logs gharbazaar-postgres

# Reset database (if needed)
docker-compose down -v
docker-compose up -d
Start-Sleep -Seconds 10
cd backend
npx prisma migrate dev
```

### TypeScript errors
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npx tsc --noEmit
```

---

## 📂 Project Structure

```
gharbazaar.in/
├── backend/
│   ├── .env                 ← Backend environment variables
│   ├── prisma/schema.prisma ← Database schema
│   ├── src/
│   │   ├── server.ts        ← Main server file
│   │   ├── config/          ← Configuration
│   │   ├── controllers/     ← Route controllers
│   │   ├── middleware/      ← Express middleware
│   │   ├── routes/          ← API routes
│   │   ├── socket/          ← Socket.IO handlers
│   │   └── utils/           ← Utilities
│   └── package.json
│
└── frontend/
    ├── .env.local           ← Frontend environment variables
    ├── next.config.js       ← Next.js configuration
    ├── src/
    │   ├── app/             ← App router pages
    │   ├── components/      ← React components
    │   ├── hooks/           ← Custom hooks
    │   │   └── api/         ← API hooks
    │   ├── lib/             ← Libraries
    │   │   └── backendApi.ts ← Backend API client
    │   ├── types/           ← TypeScript types
    │   └── contexts/        ← React contexts
    └── package.json
```

---

## 🌐 Environment Variables Reference

### Backend (`.env`)
| Variable | Development Value | Purpose |
|----------|-------------------|---------|
| `PORT` | `5001` | Backend server port |
| `NODE_ENV` | `development` | Environment mode |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/gharbazaar` | PostgreSQL connection |
| `FRONTEND_URL` | `http://localhost:3000` | Frontend URL for CORS |
| `JWT_SECRET` | `gharbazaar_dev_secret_key...` | JWT signing secret |
| `GOOGLE_CLIENT_ID` | `41166367779-tfp44...` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-8gzhwBs...` | Google OAuth secret |

### Frontend (`.env.local`)
| Variable | Development Value | Purpose |
|----------|-------------------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5001` | Backend API URL |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Frontend URL |
| `NODE_ENV` | `development` | Environment mode |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `41166367779-tfp44...` | Google OAuth client ID |

---

## ✅ Verification Checklist

Before starting development, verify:

- [ ] Docker Desktop is running
- [ ] PostgreSQL container started: `docker ps | Select-String gharbazaar`
- [ ] Backend `.env` file exists
- [ ] Frontend `.env.local` file exists
- [ ] Backend builds: `cd backend && npm run build`
- [ ] Frontend builds: `cd frontend && npm run build`
- [ ] Prisma client generated: `cd backend && npx prisma generate`
- [ ] Migrations applied: `cd backend && npx prisma migrate dev`

---

## 🎯 Development Workflow

1. **Start both servers** (backend + frontend)
2. **Make changes** to code
3. **Hot reload** automatically restarts servers
4. **Test in browser** at http://localhost:3000
5. **Check console** for errors
6. **Commit changes** when ready

---

## 📝 Important Notes

- **PostgreSQL Setup Required:** Run `docker-compose up -d` first (one-time setup)

- **Port mismatch?** Backend is on 5001, frontend on 3000
- **CORS issues?** Check FRONTEND_URL in backend/.env
- **Database issues?** Run `npx prisma studio` to inspect
- **TypeScript errors?** Run build commands to see full error list
- **Hot reload not working?** Restart the dev server

---

## 🔄 Reset Everything (Nuclear Option)

```bash
# Backend
cd backend
rm -rf node_modules dist
npm install
npx prisma generate
npx prisma migrate dev
npm run build

# Frontend
cd frontend
rm -rf node_modules .next
npm install
npm run build
```

---

**Happy Coding! 🎉**

For issues, check: `DEVELOPMENT_STABILITY_REPORT.md`
