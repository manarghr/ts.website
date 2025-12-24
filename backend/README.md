# Backend Documentation

This folder contains all backend-related code, documentation, and utilities.

## 📁 Structure

```
backend/
├── README.md                    # This file
├── API_ROUTES.md                # API endpoints documentation
├── STRUCTURE.md                 # Detailed structure explanation
│
├── utils/                       # 🔧 Utility Functions
│   ├── mongodb.js              # MongoDB connection (reference)
│   ├── db-helpers.js           # Database query helpers
│   ├── message-helpers.js      # Message handling
│   └── report-helpers.js       # Report handling
│
└── schemas/                     # 📋 Data Schemas
    └── coach-schema.js         # Coach data structure examples
```

## 🚀 Quick Start

1. **Set up MongoDB connection:**
   - Create `.env.local` file in project root
   - Add your `MONGODB_URI` (see `docs/MONGODB_SETUP.md`)

2. **Test connection:**
   - Visit: `http://localhost:3000/api/test-db`

3. **Use API endpoints:**
   - See `API_ROUTES.md` for all available endpoints

## 📍 Important Locations

- **API Routes**: `src/app/api/` (Next.js requirement - cannot be moved)
- **MongoDB Connection**: `src/lib/mongodb.js` (actual connection file)
- **Helper Functions**: `backend/utils/` (reusable database functions)
- **Frontend API Client**: `src/lib/api.js` (client-side API calls)

## 🔗 Related Files

- MongoDB connection: `src/lib/mongodb.js`
- API client: `src/lib/api.js`
- API routes: `src/app/api/`

## 📖 Documentation

- [MongoDB Setup](./docs/MONGODB_SETUP.md)
- [Backend Integration](./docs/BACKEND_INTEGRATION_GUIDE.md)
- [Testing Guide](./docs/TESTING_GUIDE.md)
- [API Routes](./API_ROUTES.md)
