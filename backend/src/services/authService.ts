import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin';

export async function login(email: string, password: string): Promise<string | null> {
  console.log('🔐 AuthService - login attempt for:', email);
  
  const admin = await Admin.findOne({ email });
  
  if (!admin) {
    console.log('❌ Admin not found');
    return null;
  }

  const isValid = await bcrypt.compare(password, admin.password_hash);
  
  if (!isValid) {
    console.log('❌ Invalid password');
    return null;
  }

  // Read JWT_SECRET here, not at module level, to ensure dotenv has loaded
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  
  console.log('✅ Password valid, generating token...');
  console.log('   JWT_SECRET:', JWT_SECRET ? 'SET (' + JWT_SECRET.substring(0, 20) + '...)' : 'NOT SET');
  
  const token = jwt.sign(
    { id: admin._id.toString(), email: admin.email, name: admin.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log('✅ Token generated:', token.substring(0, 50) + '...');
  return token;
}
