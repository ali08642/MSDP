# MSDP - Medical Surveillance & Disease Prediction System

## 🏥 Full Stack Disease Forecasting Platform

A complete web application for disease outbreak prediction, surveillance, and health analytics built with **Next.js** (frontend) and **Django REST Framework** (backend).

---

## 📁 Repository Structure

This is the **frontend** repository. The system consists of two parts:

```
MSDP/                           ← Frontend (Next.js) - You are here
├── app/                        # Next.js pages
├── components/                 # React components
├── lib/                        # Utilities
└── ...

MSDP-backend/                   ← Backend (Django) - Separate folder
├── apps/                       # Django apps
├── config/                     # Django settings
└── ...
```

### Quick Links
- **Frontend**: `d:/Github/MSDP` (this folder)
- **Backend**: `d:/Github/MSDP-backend` (created separately)
- **Backend Docs**: `d:/Github/MSDP-backend/INDEX.md` (comprehensive guide)

---

## 🎯 What Is This Project?

MSDP is a disease surveillance and forecasting system that allows:

### For Health Officials
- 📊 View disease outbreak forecasts
- 🗺️ Interactive risk heatmaps
- 📈 Resource demand estimation
- 📑 Generate and export reports

### For Lab Technicians
- 🧪 Enter laboratory test results
- 📤 Upload dataset files
- ✅ Data validation

### For Pharmacists
- 💊 Enter pharmacy sales data
- 📋 Track medication demand

### For Administrators
- 👥 User management
- 🤖 ML model training
- 📊 System monitoring
- 🔄 Data pipeline management

---

## 🏗️ Technology Stack

### Frontend (This Repository)
```
Next.js 16.0.0    - React framework
React 19.2.0      - UI library
TypeScript        - Type safety
Tailwind CSS 4    - Styling
Shadcn/UI         - Component library
Recharts          - Data visualization
```

### Backend (MSDP-backend/)
```
Django 5.0               - Web framework
Django REST Framework    - REST API
JWT Authentication       - Security
Celery + Redis          - Async tasks
PostgreSQL              - Database
scikit-learn            - Machine Learning
pandas                  - Data processing
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL (optional for dev)
- Redis (optional for dev)

### Step 1: Clone Both Repositories

```bash
# Frontend (this repository)
cd d:/Github
git clone <frontend-repo-url> MSDP

# Backend (separate repository)
git clone <backend-repo-url> MSDP-backend
```

### Step 2: Set Up Backend

```bash
cd MSDP-backend

# Run automated setup
.\setup.ps1

# Or manually:
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser

# Start backend (3 terminals)
python manage.py runserver               # Terminal 1
celery -A config worker -l info          # Terminal 2
celery -A config beat -l info            # Terminal 3
```

**Backend will run on:** `http://localhost:8000`

### Step 3: Set Up Frontend

```bash
cd d:/Github/MSDP

# Install dependencies
pnpm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start frontend
pnpm dev
```

**Frontend will run on:** `http://localhost:3000`

### Step 4: Test the Connection

1. Open `http://localhost:3000/auth/login`
2. Create account or login
3. Navigate through the dashboard
4. Check browser console for API calls

---

## 📖 Documentation

### Frontend Documentation
- **This README** - Overview
- `components/` - Component documentation in code

### Backend Documentation (MSDP-backend/)
Comprehensive guides available in the backend repository:

| Document | Purpose |
|----------|---------|
| `INDEX.md` | Documentation index |
| `GETTING_STARTED.md` | ⭐ Complete beginner guide |
| `README.md` | Quick reference |
| `ARCHITECTURE.md` | System design |
| `API_TESTING.md` | Test endpoints |
| `DEPLOYMENT.md` | Production deployment |
| `FRONTEND_INTEGRATION.md` | Connect to this frontend |

**Start here:** `d:/Github/MSDP-backend/INDEX.md`

---

## 🔗 API Integration

The frontend connects to the Django backend via REST API.

### API Base URL
```typescript
// Development
const API_URL = 'http://localhost:8000';

// Production
const API_URL = 'https://your-backend.onrender.com';
```

### Example API Call
```typescript
// lib/api.ts
const response = await fetch(`${API_URL}/api/users/login/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});

const data = await response.json();
localStorage.setItem('access_token', data.tokens.access);
```

### Main Endpoints
```
POST   /api/users/login/              - Login
POST   /api/users/register/           - Register
GET    /api/users/profile/            - Get profile
POST   /api/datasets/                 - Upload dataset
GET    /api/forecasting/models/       - List ML models
GET    /api/forecasting/forecasts/    - Get forecasts
POST   /api/reports/                  - Generate report
```

Full API documentation: `MSDP-backend/API_TESTING.md`

---

## 🎨 Frontend Structure

```
app/
├── auth/
│   ├── login/page.tsx            # Login page
│   └── signup/page.tsx           # Registration
├── admin/
│   └── dashboard/page.tsx        # Admin dashboard
├── health-official/
│   └── dashboard/page.tsx        # Forecasts view
├── lab/
│   └── data-entry/page.tsx       # Lab data entry
├── pharmacist/
│   └── data-entry/page.tsx       # Pharmacy POS
└── reports/page.tsx              # Reports

components/
├── admin/                        # Admin components
├── health-official/              # Forecast components
├── lab/                          # Lab components
├── pharmacy/                     # Pharmacy components
└── reports/                      # Report components

lib/
├── auth-context.tsx             # Authentication state
└── utils.ts                     # Utilities
```

---

## 🔐 Authentication Flow

```
1. User enters credentials
   ↓
2. Frontend calls POST /api/users/login/
   ↓
3. Backend validates and returns JWT tokens
   ↓
4. Frontend stores tokens in localStorage
   ↓
5. Future requests include: Authorization: Bearer <token>
   ↓
6. Backend validates token and returns data
```

### Protected Routes
Use the `ProtectedRoute` component:

```typescript
// components/protected-route.tsx
import { ProtectedRoute } from '@/components/protected-route';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

---

## 🚢 Deployment

### Frontend (Vercel - Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd d:/Github/MSDP
vercel

# Set environment variable in Vercel dashboard
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### Backend (Render.com - Recommended)

See `MSDP-backend/DEPLOYMENT.md` for complete guide.

Quick steps:
1. Push backend code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Add environment variables
5. Deploy!

### Full Deployment Architecture

```
Vercel (Frontend)
    ↓ API Calls
Render (Django Backend)
    ↓
Neon (PostgreSQL)
    ↓
Upstash (Redis)
```

---

## 🧪 Development Workflow

### 1. Start Backend
```bash
cd MSDP-backend
python manage.py runserver
celery -A config worker -l info
```

### 2. Start Frontend
```bash
cd MSDP
pnpm dev
```

### 3. Make Changes
```bash
# Frontend: Edit components in components/
# Backend: Edit apps in MSDP-backend/apps/
```

### 4. Test
```bash
# Frontend
pnpm build  # Check for build errors

# Backend
python manage.py test
```

---

## 📊 Features Implemented

### ✅ Authentication
- [x] User registration
- [x] JWT login/logout
- [x] Role-based access (Admin, Health Official, Lab Tech, Pharmacist)
- [x] Protected routes

### ✅ Data Management
- [x] File upload (CSV, Excel)
- [x] Data validation
- [x] Dataset management

### ✅ Forecasting
- [x] ML model training
- [x] Disease predictions
- [x] Forecast visualization
- [x] Risk heatmaps

### ✅ Reports
- [x] Generate reports (Excel, CSV)
- [x] Export functionality
- [x] Audit logging

### ✅ Admin Features
- [x] User management
- [x] System monitoring
- [x] Model management

---

## 🎓 Learning Resources

### For Frontend Development
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com)

### For Backend Development
**See:** `MSDP-backend/INDEX.md` for comprehensive guides

Topics covered:
- Django basics
- REST API design
- JWT authentication
- Celery async tasks
- ML integration
- PostgreSQL
- Deployment

---

## 🐛 Troubleshooting

### Frontend Issues

**Build errors:**
```bash
rm -rf .next node_modules
pnpm install
pnpm build
```

**API not connecting:**
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify backend is running on port 8000
- Check browser console for CORS errors

### Backend Issues

See `MSDP-backend/README.md` → Troubleshooting section

Common fixes:
```bash
# Reset database
python manage.py flush

# Recreate migrations
rm apps/*/migrations/0*.py
python manage.py makemigrations
python manage.py migrate
```

---

## 🤝 Contributing

### Frontend
1. Create feature branch
2. Make changes
3. Test locally
4. Create pull request

### Backend
See `MSDP-backend/CONTRIBUTING.md`

---

## 📄 Project Timeline

This is a **Final Year Project (FYP)** built to learn:
- Full-stack development
- REST API design
- Authentication & authorization
- Machine learning integration
- Cloud deployment
- Modern web development practices

**Estimated Learning Time:**
- Week 1: Setup & basics
- Week 2-3: Development
- Week 4: Deployment & polish

---

## 🎯 Next Steps

### If you're new here:
1. **Read:** `MSDP-backend/GETTING_STARTED.md`
2. **Setup:** Run `setup.ps1` in backend
3. **Test:** Follow `MSDP-backend/API_TESTING.md`
4. **Build:** Start with simple changes

### If you're ready to deploy:
1. **Test locally** - Make sure everything works
2. **Deploy backend** - Follow `MSDP-backend/DEPLOYMENT.md`
3. **Deploy frontend** - Push to Vercel
4. **Configure** - Set production environment variables

### If you want to add features:
1. **Backend:** See `MSDP-backend/CONTRIBUTING.md`
2. **Frontend:** Create component in `components/`
3. **Test:** Ensure API integration works
4. **Document:** Update README

---

## 📞 Support

### Documentation
- **Backend:** `d:/Github/MSDP-backend/INDEX.md` (start here!)
- **API Reference:** `MSDP-backend/API_TESTING.md`
- **Deployment:** `MSDP-backend/DEPLOYMENT.md`

### External Resources
- Django: https://docs.djangoproject.com
- Next.js: https://nextjs.org/docs
- Stack Overflow: Tag django, next.js

---

## 🎉 Summary

You have a **complete full-stack application** with:

**Frontend (Next.js):**
- ✅ Modern React 19 + TypeScript
- ✅ Tailwind CSS + Shadcn/UI
- ✅ Protected routes
- ✅ API integration ready

**Backend (Django):**
- ✅ REST API with 20+ endpoints
- ✅ JWT authentication
- ✅ 4 modular apps
- ✅ Celery async tasks
- ✅ ML integration
- ✅ Production ready
- ✅ 3,000+ lines of documentation

**Total:** Professional, portfolio-worthy project!

---

## 🚀 Get Started Now!

```bash
# 1. Setup backend
cd d:/Github/MSDP-backend
.\setup.ps1

# 2. Setup frontend
cd d:/Github/MSDP
pnpm install

# 3. Start both
# Backend: python manage.py runserver
# Frontend: pnpm dev

# 4. Open browser
# http://localhost:3000
```

**Then read:** `d:/Github/MSDP-backend/GETTING_STARTED.md`

**Happy coding! 🎓**
