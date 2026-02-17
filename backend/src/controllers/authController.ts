import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { login } from '../services/authService';
import { AuthRequest } from '../middleware/authMiddleware';

export async function loginAdmin(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0]?.msg || 'Invalid input',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const token = await login(email, password);

    if (!token) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const sameSite: 'none' | 'lax' = isProduction ? 'none' : 'lax';

    // Cross-site frontend/backend deployment needs SameSite=None in production.
    // Local dev keeps Lax for simpler localhost behavior.
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    // Set HttpOnly cookie
    res.cookie('token', token, {
      ...cookieOptions
    });

    return res.json({ success: true, message: 'Logged in successfully' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: 'Login failed' });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Not authenticated' });
        }
        
        // Return the user data stored in the token (or valid session)
        // Ensure we don't return sensitive data like password_hash if we were fetching from DB again
        return res.json({ 
            success: true, 
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email
            } 
        });
    } catch (error) {
        console.error('GetMe error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch user details' });
    }
}

// setupAdmins removed for security

export async function logoutAdmin(req: Request, res: Response) {
    try {
        const isProduction = process.env.NODE_ENV === 'production';
        const sameSite: 'none' | 'lax' = isProduction ? 'none' : 'lax';
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProduction,
            sameSite
        });
        return res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ success: false, error: 'Logout failed' });
    }
}
