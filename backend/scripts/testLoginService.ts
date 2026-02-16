import { connectDB } from '../src/config/db';
import { login } from '../src/services/authService';

async function testLoginService() {
  try {
    await connectDB();
    console.log('🔍 Testing login service...\n');

    const email = 'ieeekiitstudentbaranch@gmail.com';
    const password = 'Mandalp166#';

    console.log('Attempting login with:');
    console.log('  Email:', email);
    console.log('  Password:', password);
    console.log('');

    const token = await login(email, password);

    if (token) {
      console.log('✅ Login successful!');
      console.log('Token:', token.substring(0, 80) + '...');
    } else {
      console.log('❌ Login failed - Invalid credentials');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testLoginService();
