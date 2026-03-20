import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

// Import routes
import authRoutes from './routes/auth';
import childRoutes from './routes/children';
import routineRoutes from './routes/routines';
import activityLogRoutes from './routes/activityLogs';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Database connection status
let dbConnected = false;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'RoutineWise API is running',
    database: dbConnected ? 'connected' : 'disconnected',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', childRoutes);
app.use('/api', routineRoutes);
app.use('/api', activityLogRoutes);

// 404 handler - must be after all routes
app.use((req: express.Request, res: express.Response) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Error handling middleware (must be last)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong!',
  });
});

// Start server first, then try to connect to database
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);

  // Try to connect to MongoDB (but don't fail if it's not available)
  connectDB()
    .then(() => {
      dbConnected = true;
      console.log('✅ Database connected successfully');
    })
    .catch((error) => {
      dbConnected = false;
      console.warn('⚠️  Database connection failed (MongoDB may not be running):');
      console.warn('   Server will continue running, but database features will be unavailable');
      console.warn('   To enable database features, start MongoDB and restart the server');
    });
});

export default app;
