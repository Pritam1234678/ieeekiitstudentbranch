import { Admin } from '../src/models/admin';
import { connectDB } from '../src/config/db';
import jwt from 'jsonwebtoken';

async function testJWT() {
  try {
    await connectDB();
    console.log('🔍 Testing JWT token generation and validation...\n');

    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    console.log('JWT_SECRET from env:', JWT_SECRET);
    console.log('');

    // Find admin
    const admin = await Admin.findOne({ email: 'ieeekiitstudentbranch@gmail.com' });
    
    if (!admin) {
      console.log('❌ Admin not found');
      process.exit(1);
    }

    // Generate token (same as authService)
    const token = jwt.sign(
      { id: admin._id.toString(), email: admin.email, name: admin.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Token generated:', token.substring(0, 50) + '...\n');

    // Verify token (same as authMiddleware)
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('✅ Token verified successfully!');
      console.log('Decoded payload:', decoded);
    } catch (err) {
      console.log('❌ Token verification failed:', err);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testJWT();
