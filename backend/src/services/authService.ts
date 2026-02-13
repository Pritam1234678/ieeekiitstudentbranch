import { executeQuery } from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface Admin {
  id: number;
  name: string;
  email: string;
  password_hash: string;
}

export async function login(email: string, password: string): Promise<string | null> {
  const query = 'SELECT * FROM admins WHERE email = ?';
  const admins = await executeQuery<Admin[]>(query, [email]);

  if (admins.length === 0) {
    return null;
  }

  const admin = admins[0];
  const passwordMatch = await bcrypt.compare(password, admin.password_hash);

  if (!passwordMatch) {
    return null;
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, name: admin.name },
    process.env.JWT_SECRET || 'your_super_secret_key',
    { expiresIn: '24h' }
  );

  return token;
}
