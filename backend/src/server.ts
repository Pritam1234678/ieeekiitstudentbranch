import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventRoutes from './routes/eventRoutes';
import societyRoutes from './routes/societyRoutes';
import authRoutes from './routes/authRoutes';
import { connectDB, checkDatabaseHealth } from './config/db';

dotenv.config();

// Connect to MongoDB
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000', // Explicitly allow localhost:3000 (even if FRONTEND_URL is set)
    'http://localhost:3001',
    'https://www.ieeestudentbranchkiit.in', // Production Domain (www)
    'https://ieeestudentbranchkiit.in',     // Production Domain (no-www)
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', async (req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseHealth();
  res.json({
    status: 'OK',
    database: dbHealthy ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/societies', societyRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Server is running on port ${PORT}
📡 API: http://localhost:${PORT}/api/events
📡 API: http://localhost:${PORT}/api/societies
💚 Health: http://localhost:${PORT}/health
  `);
});

export default app;
