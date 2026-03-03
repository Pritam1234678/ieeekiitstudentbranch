import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  // Anti-CSRF Protection for all state-changing admin actions
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const origin = req.get('origin') || req.get('referer');
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000', 
      'http://localhost:3001',
      'https://www.ieeestudentbranchkiit.in', 
      'https://ieeestudentbranchkiit.in'
    ];
    
    if (!origin || !allowedOrigins.some(o => origin.startsWith(o))) {
        return res.status(403).json({ success: false, error: 'Forbidden: CSRF token mismatch or invalid Origin header.' });
    }
  }

  const authHeader = req.headers['authorization'];
  // Check header OR cookie
  const token = (authHeader && authHeader.split(' ')[1]) || req.cookies?.token;

  if (token == null) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET not defined');
    return res.status(500).json({ success: false, error: 'Server misconfiguration' });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ success: false, error: 'Invalid or expired token' });
      }
      req.user = user;
      next();
    }
  );
}
