import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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
app.set('trust proxy', 1); // Trust first proxy (Railway Load Balancer)

app.use(helmet()); // Security headers

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

// Health check
app.get('/health', async (req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseHealth();
  res.json({
    status: 'OK',
    database: dbHealthy ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.get('/version', (req: Request, res: Response) => {  res.json({ version: '1.0.1' }); });

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1, // Set to 1 to force block immediately
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts',
  handler: (req, res, next, options) => {
      console.log(`[RATE LIMIT] Blocked IP: ${req.ip}`);
      res.status(options.statusCode).send(options.message);
  }
});

const botBlocker = (req: Request, res: Response, next: any) => {
  const userAgent = req.get('User-Agent') || '';
  console.error(`[BOT CHECK ERROR LOG] UA: ${userAgent} | IP: ${req.ip}`);
  
  // FORCE BLOCK EVERYTHING TO TEST DEPLOYMENT
  if (true || /curl|wget|python|postman|insomnia/i.test(userAgent)) {
    console.error(`[BLOCK] Blocked Bot: ${userAgent}`);
    return res.status(403).json({ success: false, error: 'Bots not allowed (TEST BLOCK)' });
  }
  next();
};

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/societies', societyRoutes);
// Apply strict limits and bot blocking
app.use('/api/auth', authLimiter, botBlocker, authRoutes);

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
