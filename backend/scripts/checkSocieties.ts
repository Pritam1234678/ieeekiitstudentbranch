import { connectDB } from '../src/config/db';
import { Society } from '../src/models/society';

async function checkSocieties() {
  try {
    await connectDB();
    console.log('🔍 Checking societies in database...\n');

    const societies = await Society.find({});
    
    console.log(`Found ${societies.length} societies:\n`);
    
    societies.forEach((society, index) => {
      console.log(`${index + 1}. ${society.name}`);
      console.log(`   ID: ${society._id}`);
      console.log(`   Chair: ${society.chair_name || 'N/A'}`);
      console.log(`   Faculty: ${society.faculty_name || 'N/A'}`);
      console.log(`   Logo: ${society.logo_url || 'N/A'}`);
      console.log(`   Description: ${society.description?.substring(0, 50) || 'N/A'}...`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkSocieties();
