import bcrypt from 'bcrypt';
import { Admin } from '../src/models/admin';
import { connectDB } from '../src/config/db';

async function updateAdminEmail() {
  try {
    await connectDB();
    console.log('🔄 Updating admin email...\n');

    // Find the existing admin
    const oldEmail = 'ieeekiitstudentbranch@gmail.com';
    const newEmail = 'ieeekiitstudentbaranch@gmail.com';

    const admin = await Admin.findOne({ email: oldEmail });

    if (!admin) {
      console.log('❌ Admin not found with email:', oldEmail);
      process.exit(1);
    }

    // Update email
    admin.email = newEmail;
    await admin.save();

    console.log('✅ Admin email updated successfully!');
    console.log('   Old email:', oldEmail);
    console.log('   New email:', newEmail);
    console.log('\nYou can now login with:');
    console.log('   Email:', newEmail);
    console.log('   Password: Mandalp166#');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin:', error);
    process.exit(1);
  }
}

updateAdminEmail();
