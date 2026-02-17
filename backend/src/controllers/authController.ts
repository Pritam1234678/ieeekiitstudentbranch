import { Request, Response } from 'express';
import { login } from '../services/authService';
import { AuthRequest } from '../middleware/authMiddleware';

export async function loginAdmin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
       return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const token = await login(email, password);

    if (!token) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    return res.json({ success: true, token });
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
        return res.status(500).json({ success: false, error: 'Failed to fetch user details' });
    }
}

export async function setupAdmins(req: Request, res: Response) {
    try {
        const { Admin } = require('../models/admin');
        const bcrypt = require('bcrypt');
        
        // Check if admin exists to avoid overwrite if unwanted, but script clears
        // We will clear as per script logic because user wants reset
        await Admin.deleteMany({});
        
        const passwordHash = await bcrypt.hash('Mandalp166#', 10);
        
        const admins = [
            {
                name: 'Pritam Mandal',
                email: 'ieeekiitstudentbranch@gmail.com', // Correct email
                password_hash: passwordHash,
                phone_no: '9832956892'
            },
            {
                name: 'Pritam Typo Check',
                email: 'ieeekiitstudentbaranch@gmail.com', // Add typo version just in case user insists
                password_hash: passwordHash,
                phone_no: '0000000000'
            }
        ];
        
        await Admin.insertMany(admins);
        
        return res.json({ 
            success: true, 
            message: 'Admins set up successfully',
            debug: {
                jwtSecretExists: !!process.env.JWT_SECRET,
                mongoUriExists: !!process.env.MONGO_URI
            }
        });
    } catch (error: any) {
        console.error('Setup Admins error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
