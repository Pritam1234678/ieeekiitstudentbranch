import bcrypt from 'bcrypt';
import { Admin } from '../src/models/admin';
import { connectDB } from '../src/config/db';

async function setupAdmins() {
  try {
    await connectDB();
    console.log('🔄 Setting up admins...');

    // Clear existing admins
    await Admin.deleteMany({});
    console.log('✅ Cleared existing admins');

    // Create admin users
    const admins = [
      {
        name: 'Pritam Mandal',
        email: 'ieeekiitstudentbranch@gmail.com',
        password_hash: await bcrypt.hash('Mandalp166#', 10),
        phone_no: '9832956892'
      }
    ];

    await Admin.insertMany(admins);
    console.log(`✅ Created ${admins.length} admin(s)`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up admins:', error);
    process.exit(1);
  }
}

setupAdmins();
