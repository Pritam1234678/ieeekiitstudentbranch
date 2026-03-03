import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import eventRoutes from './routes/eventRoutes';
import societyRoutes from './routes/societyRoutes';
import authRoutes from './routes/authRoutes';
import { connectDB, checkDatabaseHealth } from './config/db';
import cookieParser from 'cookie-parser';

dotenv.config();

// Connect to MongoDB
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Check for essential environment variables
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}

// Middleware
// Trust proxy headers in hosted environments so req.ip reflects real client IP.
// Trust proxy headers for rate limiting
app.set('trust proxy', 1);

app.use(helmet()); // Security headers
// Serve static files from uploads directory
// Override helmet's default `Cross-Origin-Resource-Policy: same-origin` so images can be
// loaded cross-origin (frontend on :3000 fetching images from backend on :5000).
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(process.cwd(), 'public/uploads')));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply rate limiting to all requests
app.use(limiter);

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000', 
    'http://localhost:3001',
    'https://www.ieeestudentbranchkiit.in', 
    'https://ieeestudentbranchkiit.in',     
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', async (req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseHealth();
  res.json({
    status: 'OK',
    database: dbHealthy ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.get('/version', (req: Request, res: Response) => {  res.json({ version: '1.0.2' }); });

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
🚀 Server is running on port ${PORT} WITH SECURITY PATCHES 2.0
📡 API: http://localhost:${PORT}/api/events
📡 API: http://localhost:${PORT}/api/societies
💚 Health: http://localhost:${PORT}/health
  `);
});

export default app;
