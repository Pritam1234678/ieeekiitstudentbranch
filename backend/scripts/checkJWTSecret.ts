import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Checking JWT Secret Configuration...\n');
console.log('JWT_SECRET from .env:', process.env.JWT_SECRET);
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
console.log('');

// Check what authService would use
const authServiceSecret = process.env.JWT_SECRET || 'your-secret-key';
console.log('authService would use:', authServiceSecret);

// Check what authMiddleware would use  
const authMiddlewareSecret = process.env.JWT_SECRET || 'your-secret-key';
console.log('authMiddleware would use:', authMiddlewareSecret);

console.log('');
console.log('Secrets match:', authServiceSecret === authMiddlewareSecret ? '✅ YES' : '❌ NO');
