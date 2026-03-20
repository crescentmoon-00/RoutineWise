# RoutineWise

A responsive web application (PWA) designed to reduce anxiety for neurodivergent children (ages 2-8) and cognitive load for parents.

## Features

- **Visual Schedule**: Interactive timeline with large touch targets for children
- **Smart Rule Builder**: AI-powered natural language rule creation
- **Quick Logging**: One-tap activity tracking for parents
- **PDF Reports**: Professional reports for doctors, therapists, and IEP meetings
- **Offline Support**: PWA with service workers for offline access

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB
- **AI**: OpenAI API (for natural language rule parsing)
- **Testing**: Jest (backend), Vitest + React Testing Library (frontend)

## Project Structure

```
routinewise/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React Context for state management
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   ├── hooks/        # Custom React hooks
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions
│   └── package.json
├── backend/           # Node.js + Express backend
│   ├── src/
│   │   ├── routes/      # API route handlers
│   │   ├── models/      # MongoDB schemas
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/  # Express middleware
│   │   ├── config/      # Configuration files
│   │   ├── utils/       # Utility functions
│   │   └── tests/       # Backend tests
│   └── package.json
├── implementation-phases.md  # Detailed implementation plan
├── prd.md                    # Product Requirements Document
└── styles.json               # Design system tokens
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB 6+ (optional for initial development - see below)

### MongoDB Setup (Optional for UI Development)

The backend server can run without MongoDB for frontend development and UI testing. Database features will be unavailable until MongoDB is connected.

**Quick MongoDB Setup Options:**

1. **Local Installation**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb

   # macOS
   brew install mongodb-community

   # Start MongoDB
   sudo systemctl start mongodb
   # or
   mongod
   ```

2. **Docker (Recommended for Development)**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

3. **MongoDB Atlas (Cloud - Free Tier)**
   - Create account at https://www.mongodb.com/atlas
   - Create free cluster
   - Get connection string
   - Update `backend/.env` with your Atlas URI

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd routinewise
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Configure environment variables:
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI (optional for dev) and JWT secret

# Frontend
cd ../frontend
cp .env.example .env
# Edit .env with your API URL
```

4. Check MongoDB (optional):
```bash
cd backend
./check-mongodb.sh
```

5. Run the application:
```bash
# Terminal 1 - Start backend
cd backend
npm run dev
# Note: Backend will start even without MongoDB (database features will be disabled)

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

6. Open your browser:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health

7. Check database status:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "RoutineWise API is running",
  "database": "connected" | "disconnected"
}
```

**Note:** The backend will show a warning if MongoDB is not running, but will continue to work for API testing and UI development. Database features will be enabled once MongoDB is connected.

## Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

### Backend
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript
npm start            # Start production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## Design System

This project follows the "Supportive Canvas" design philosophy:

- **Creative North Star**: "The Mindful Anchor"
- **No-Line Rule**: Use tonal shifts instead of 1px borders
- **Surface Hierarchy**: Multiple surface container layers for depth
- **Typography**: Lexend font for neurodivergent-friendly readability
- **Accessibility**: WCAG 2.1 AA compliant

See `implementation-phases.md` for complete design system documentation.

## Implementation Phases

1. ✅ Phase 1: Project Foundation & Infrastructure
2. Phase 2: Backend API & Core Data Structures
3. Phase 3: Frontend - Authentication & Child Management
4. Phase 4: Visual Schedule (Child View)
5. Phase 5: Rules Engine (Without AI)
6. Phase 6: AI-Powered Smart Rule Builder
7. Phase 7: Quick Logging & Tracking
8. Phase 8: Reporting & Export
9. Phase 9: PWA & Offline Capability
10. Phase 10: Accessibility & Polish
11. Phase 11: Monetization Features (Optional)
12. Phase 12: Deployment & DevOps

## Testing

### Frontend Tests
```bash
cd frontend
npm run test                    # Run all tests
npm run test:coverage           # Run with coverage
```

### Backend Tests
```bash
cd backend
npm test                        # Run all tests
npm run test:watch              # Watch mode
npm run test:coverage           # Coverage report
```

## Contributing

1. Follow the coding standards defined in `implementation-phases.md`
2. Ensure all tests pass before submitting PR
3. Maintain >80% code coverage
4. Follow accessibility best practices (WCAG 2.1 AA)

## License

ISC

## Support

For support, email support@routinewise.com or open an issue in the repository.
