import fetch from 'node-fetch';

async function testLogin() {
  try {
    console.log('Testing login endpoint...\n');
    
    // Test login
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'ieeekiitstudentbranch@gmail.com',
        password: 'Mandalp166#'
      }),
    });

    const loginData = await loginRes.json();
    console.log('Login response:', loginData);

    if (!loginData.success) {
      console.log('\n❌ Login failed!');
      process.exit(1);
    }

    const token = loginData.token;
    console.log('\n✅ Login successful!');
    console.log('Token:', token.substring(0, 50) + '...\n');

    // Test /me endpoint
    console.log('Testing /me endpoint...\n');
    const meRes = await fetch('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const meData = await meRes.json();
    console.log('/me response:', meData);

    if (meData.success) {
      console.log('\n✅ Authentication working correctly!');
      console.log('User:', meData.user);
    } else {
      console.log('\n❌ /me endpoint failed!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testLogin();
