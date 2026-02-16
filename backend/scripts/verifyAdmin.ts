import bcrypt from 'bcrypt';
import { Admin } from '../src/models/admin';
import { connectDB } from '../src/config/db';

async function verifyAdmin() {
  try {
    await connectDB();
    console.log('🔍 Verifying admin credentials...\n');

    const email = 'ieeekiitstudentbranch@gmail.com';
    const password = 'Mandalp166#';

    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.log('❌ Admin not found with email:', email);
      process.exit(1);
    }

    console.log('✅ Admin found:');
    console.log('   Name:', admin.name);
    console.log('   Email:', admin.email);
    console.log('   Phone:', admin.phone_no || 'N/A');

    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (isPasswordValid) {
      console.log('\n✅ Password is CORRECT!');
      console.log('   You can login with:');
      console.log('   Email:', email);
      console.log('   Password:', password);
    } else {
      console.log('\n❌ Password is INCORRECT!');
      console.log('   The password you provided does not match.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyAdmin();
