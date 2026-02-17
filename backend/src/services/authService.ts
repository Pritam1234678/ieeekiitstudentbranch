import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin';

export async function login(email: string, password: string): Promise<string | null> {
  const admin = await Admin.findOne({ email });
  
  if (!admin) {
    return null;
  }

  const isValid = await bcrypt.compare(password, admin.password_hash);
  
  if (!isValid) {
    return null;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined'); 
  }
  
  const token = jwt.sign(
    { id: admin._id.toString(), email: admin.email, name: admin.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return token;
}
