// ⚠️ WARNING: This script is for initial setup/development only.
// Do not run in production unless you intend to RESET admins.
// Ideally, delete this file or restrict access in production.

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { Admin } from '../src/models/admin';
import { connectDB } from '../src/config/db';

async function setupAdmins() {
  try {
    // Validate Env Vars
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
    }

    await connectDB();
    console.log('🔄 Setting up admins...');

    // Clear existing admins
    await Admin.deleteMany({});
    console.log('✅ Cleared existing admins');

    // Create admin users
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const admins = [
      {
        name: 'Admin User',
        email: process.env.ADMIN_EMAIL,
        password_hash: passwordHash,
        phone_no: '0000000000'
      }
    ];

    await Admin.insertMany(admins);
    console.log(`✅ Created ${admins.length} admin(s)`);
    console.log(`📧 Email: ${process.env.ADMIN_EMAIL}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up admins:', error);
    process.exit(1);
  }
}

setupAdmins();
