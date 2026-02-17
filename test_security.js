const https = require('https');

function request(path, ua) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'ieee-backend-api-production.up.railway.app',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': ua
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data });
      });
    });
    
    req.write(JSON.stringify({ email: 'test@example.com', password: 'password' }));
    req.end();
  });
}

async function run() {
  console.log('--- Testing Bot Protection (UA: curl/7.68.0) ---');
  const resBot = await request('/api/auth/login', 'curl/7.68.0');
  console.log(`Status: ${resBot.status}`);
  console.log(`Body: ${resBot.body}`);

  console.log('\n--- Testing Rate Limit (UA: MyClient) ---');
  for (let i = 1; i <= 7; i++) {
    const res = await request('/api/auth/login', 'MyClient');
    console.log(`Req ${i}: Status ${res.status}`);
    if (res.status === 429) {
      console.log('✅ Rate Limit hit!');
      console.log(`Body: ${res.body}`);
      break;
    }
    // minimal delay
    await new Promise(r => setTimeout(r, 100));
  }
}

run();
