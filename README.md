# 🏠 GharBazaar - Real Estate Platform

> A modern, full-stack real estate platform built with Next.js, Node.js, Express, Prisma, and PostgreSQL

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)

---

## 📚 Quick Navigation

**📖 [Complete Documentation Index (DOCS_INDEX.md)](DOCS_INDEX.md)** - Organized by role, topic, and priority

### 🚀 Getting Started (Start Here!)
| Document | Description |
|----------|-------------|
| **[🎯 DEV_QUICKSTART.md](DEV_QUICKSTART.md)** | **Quick setup guide - Commands to get started immediately** |
| **[✅ DATABASE_SETUP_SUCCESS.md](DATABASE_SETUP_SUCCESS.md)** | **Database setup confirmation & management guide** |
| **[🔧 DEVELOPMENT_STABILITY_REPORT.md](DEVELOPMENT_STABILITY_REPORT.md)** | **Complete dev environment configuration report** |

### 📖 Project Documentation
| Document | Description |
|----------|-------------|
| [📋 COMPLETE_PROJECT_GUIDE.md](COMPLETE_PROJECT_GUIDE.md) | Complete project overview and structure |
| [🌐 COMPLETE_WEBSITE_SUMMARY.md](COMPLETE_WEBSITE_SUMMARY.md) | Website features and functionality summary |
| [📊 COMPLETE_CODEBASE_ANALYSIS.md](COMPLETE_CODEBASE_ANALYSIS.md) | Detailed codebase analysis and architecture |

### 🏗️ Architecture & Technical
| Document | Description |
|----------|-------------|
| [🔌 REALTIME_ARCHITECTURE_REPORT.md](REALTIME_ARCHITECTURE_REPORT.md) | Socket.IO and real-time features architecture |
| [⚡ WORKFLOW_ARCHITECTURE_REPORT.md](WORKFLOW_ARCHITECTURE_REPORT.md) | Business workflow and process architecture |
| [🤝 API_CONTRACT_ALIGNMENT.md](API_CONTRACT_ALIGNMENT.md) | Frontend-Backend API alignment documentation |
| [📱 PWA_STATUS.md](PWA_STATUS.md) | Progressive Web App implementation status |

### 📈 Progress & Implementation
| Document | Description |
|----------|-------------|
| [✨ IMPLEMENTATION_PROGRESS.md](IMPLEMENTATION_PROGRESS.md) | Feature implementation progress tracker |
| [🎉 PHASE2_COMPLETION_REPORT.md](PHASE2_COMPLETION_REPORT.md) | Phase 2 features completion report |

### 🔐 Security & Operations
| Document | Description |
|----------|-------------|
| [🔒 SECRET_ROTATION_GUIDE.md](SECRET_ROTATION_GUIDE.md) | Security best practices and secret rotation |

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js v18+
- Docker Desktop (for PostgreSQL)

### 1️⃣ Setup Database
```bash
# Start PostgreSQL via Docker
docker-compose up -d

# Wait 10 seconds for database to be ready
Start-Sleep -Seconds 10

# Apply database schema
cd backend
npx prisma generate
npx prisma migrate deploy
```

### 2️⃣ Start Backend
```bash
# Terminal 1
cd backend
npm install
npm run dev
```
**Backend running at:** http://localhost:5001

### 3️⃣ Start Frontend
```bash
# Terminal 2
cd frontend
npm install
npm run dev
```
**Frontend running at:** http://localhost:3000

---

## 📦 Project Structure

```
gharbazaar.in/
├── 📂 backend/              # Node.js + Express + Prisma backend
│   ├── src/
│   │   ├── controllers/     # API route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── socket/          # Socket.IO handlers
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Main server file
│   ├── prisma/              # Database schema & migrations
│   └── .env                 # Backend environment variables
│
├── 📂 frontend/             # Next.js 16 frontend
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── api/         # API integration hooks
│   │   ├── lib/             # Utilities & API client
│   │   ├── contexts/        # React contexts
│   │   └── types/           # TypeScript types
│   └── .env.local           # Frontend environment variables
│
├── 📂 docs/                 # Additional documentation
├── 📄 docker-compose.yml    # PostgreSQL container config
└── 📜 *.md                  # Project documentation files
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Query (TanStack Query)
- **Real-time:** Socket.IO Client

### Backend
- **Runtime:** Node.js + Express
- **Language:** TypeScript
- **Database:** PostgreSQL 16
- **ORM:** Prisma
- **Real-time:** Socket.IO
- **Authentication:** JWT + Google OAuth

### Infrastructure
- **Database:** Docker (PostgreSQL container)
- **Email:** Zoho SMTP
- **File Storage:** Local/Cloudinary

---

## 🌟 Key Features

### For Buyers
- 🏘️ Property search and browsing
- ⭐ Favorites and saved searches
- 💬 Real-time chat with sellers
- 🤝 Bid/Offer management
- 📄 Contract management
- 📍 Location-based search

### For Sellers
- 📝 Property listing management
- 📊 Analytics dashboard
- 💰 Pricing recommendations
- 🔔 Real-time notifications
- 📈 Performance metrics
- 🛡️ KYC verification

### For Admins
- 👥 User management
- 🏢 Property approval workflow
- 💳 Payment tracking
- 📊 System analytics
- 🎫 Support ticket system
- 📢 Announcements

### For Employees
- 🎫 Ticket management
- 👤 Lead management
- ⏰ Attendance tracking
- 📋 Task management
- 🏠 Property verification

---

## 📝 Environment Setup

### Backend `.env`
```env
PORT=5001
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gharbazaar"
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NODE_ENV=development
```

---

## 🧪 Testing

### Backend Health Check
```bash
curl http://localhost:5001
# Expected: {"success":true,"message":"GharBazaar Socket.IO Backend API"...}
```

### Frontend Access
Open browser: http://localhost:3000

### Database GUI (Prisma Studio)
```bash
cd backend
npx prisma studio
# Opens at http://localhost:5555
```

---

## 📚 Detailed Documentation

### For Developers
- **Setup:** Start with [DEV_QUICKSTART.md](DEV_QUICKSTART.md)
- **Database:** See [DATABASE_SETUP_SUCCESS.md](DATABASE_SETUP_SUCCESS.md)
- **Stability Report:** Check [DEVELOPMENT_STABILITY_REPORT.md](DEVELOPMENT_STABILITY_REPORT.md)
- **API Alignment:** Review [API_CONTRACT_ALIGNMENT.md](API_CONTRACT_ALIGNMENT.md)

### For Architects
- **System Overview:** [COMPLETE_PROJECT_GUIDE.md](COMPLETE_PROJECT_GUIDE.md)
- **Codebase Analysis:** [COMPLETE_CODEBASE_ANALYSIS.md](COMPLETE_CODEBASE_ANALYSIS.md)
- **Real-time Architecture:** [REALTIME_ARCHITECTURE_REPORT.md](REALTIME_ARCHITECTURE_REPORT.md)
- **Workflow Design:** [WORKFLOW_ARCHITECTURE_REPORT.md](WORKFLOW_ARCHITECTURE_REPORT.md)

### For Project Managers
- **Implementation Status:** [IMPLEMENTATION_PROGRESS.md](IMPLEMENTATION_PROGRESS.md)
- **Phase 2 Report:** [PHASE2_COMPLETION_REPORT.md](PHASE2_COMPLETION_REPORT.md)
- **Feature Summary:** [COMPLETE_WEBSITE_SUMMARY.md](COMPLETE_WEBSITE_SUMMARY.md)

### For DevOps/Security
- **Security Guide:** [SECRET_ROTATION_GUIDE.md](SECRET_ROTATION_GUIDE.md)
- **PWA Status:** [PWA_STATUS.md](PWA_STATUS.md)

---

## 💡 Common Commands

### Development
```bash
# Backend dev mode (hot reload)
cd backend
npm run dev

# Frontend dev mode
cd frontend
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

### Database Management
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Deploy migrations (production)
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

### Docker/PostgreSQL
```bash
# Start PostgreSQL
docker-compose up -d

# Stop PostgreSQL
docker-compose down

# View logs
docker logs gharbazaar-postgres

# Reset database (removes all data!)
docker-compose down -v
docker-compose up -d
```

---

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker ps | Select-String gharbazaar

# Start if not running
docker-compose up -d

# Check logs
docker logs gharbazaar-postgres
```

### Port Already in Use
```bash
# Check what's using port 5001 (backend)
netstat -ano | findstr :5001

# Check what's using port 3000 (frontend)
netstat -ano | findstr :3000
```

### TypeScript Errors
```bash
# Rebuild backend
cd backend
rm -rf dist
npm run build

# Clear frontend cache
cd frontend
rm -rf .next
npm run build
```

### Prisma Issues
```bash
# Regenerate client
npx prisma generate

# Reset and reapply migrations
npx prisma migrate reset
npx prisma migrate dev
```

---

## 🤝 Contributing

1. **Check Documentation:** Review relevant docs before making changes
2. **Follow Standards:** Use existing code patterns
3. **Update Docs:** Update relevant .md files when adding features
4. **Test Locally:** Ensure both frontend and backend work

---

## 📄 License

MIT License - See LICENSE file for details

---

## 📞 Support

- **Documentation Issues:** Check the relevant .md file from the table above
- **Setup Issues:** See [DEV_QUICKSTART.md](DEV_QUICKSTART.md)
- **Database Issues:** See [DATABASE_SETUP_SUCCESS.md](DATABASE_SETUP_SUCCESS.md)

---

## 🎯 Development Checklist

Before starting development, ensure:

- [ ] Docker Desktop is running
- [ ] PostgreSQL container is running (`docker ps`)
- [ ] Backend `.env` file exists and is configured
- [ ] Frontend `.env.local` file exists and is configured
- [ ] Database migrations are applied (`npx prisma migrate deploy`)
- [ ] Backend builds without errors (`npm run build`)
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Backend is running on port 5001
- [ ] Frontend is running on port 3000

**✅ Ready to code!**

---

## 📊 Project Status

- ✅ **Development Environment:** Fully configured and stable
- ✅ **Database:** PostgreSQL running via Docker
- ✅ **Backend:** Node.js + Express + Prisma operational
- ✅ **Frontend:** Next.js 16 operational
- ✅ **Real-time Features:** Socket.IO integrated
- ✅ **Authentication:** JWT + Google OAuth working
- ✅ **API Alignment:** Frontend ↔ Backend aligned
- ✅ **Hot Reload:** Working for both frontend and backend

**Status:** 🟢 Ready for Development

---

*Last Updated: February 27, 2026*
*For detailed setup instructions, see [DEV_QUICKSTART.md](DEV_QUICKSTART.md)*
