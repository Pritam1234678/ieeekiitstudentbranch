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
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('🔐 Auth middleware - checking token...');
  console.log('   Token present:', !!token);
  console.log('   JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');

  if (token == null) {
    console.log('❌ No token provided');
    return res.sendStatus(401);
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || 'your-secret-key',
    (err: any, user: any) => {
      if (err) {
        console.log('❌ Token verification failed:', err.message);
        return res.sendStatus(403);
      }
      console.log('✅ Token verified, user:', user);
      req.user = user;
      next();
    }
  );
}
