import { Society } from '../src/models/society';
import { connectDB } from '../src/config/db';

async function setupSocieties() {
  try {
    await connectDB();
    console.log('🔄 Setting up societies...');

    // Clear existing societies
    await Society.deleteMany({});
    console.log('✅ Cleared existing societies');

    // Create societies
    const societies = [
      {
        name: 'IEEE Computer Society KIIT Student Branch Chapter',
        logo_url: '/images/societies/cs.png',
        chair_name: 'Priyajit Panth',
        description: 'A student-led society focused on technical excellence in computer science and engineering.',
        faculty_name: 'Dr. Ananya Paul'
      },
      {
        name: 'IEEE Antennas & Propagation Society KIIT Student Branch Chapter',
        logo_url: '/images/societies/aps.png',
        chair_name: 'Ananya Paul',
        description: 'A community centered around wireless communication, antenna design, and electromagnetic theory.',
        faculty_name: 'Dr. Rajesh Kumar'
      },
      {
        name: 'IEEE Industry Applications Society KIIT Student Branch Chapter',
        logo_url: '/images/societies/ias.png',
        chair_name: 'Rahul Sharma',
        description: 'To be announced',
        faculty_name: 'Dr. Priya Singh'
      },
      {
        name: 'IEEE Instrumentation & Measurement Society KIIT Student Branch Chapter',
        logo_url: '/images/societies/ims.png',
        chair_name: 'Sneha Patel',
        description: 'Focuses on precision measurement technologies and instrumentation systems.',
        faculty_name: 'Dr. Amit Verma'
      },
      {
        name: 'IEEE Computational Intelligence Society KIIT Student Branch Chapter',
        logo_url: '/images/societies/cis.png',
        chair_name: 'Vikram Reddy',
        description: 'Explores AI, machine learning, and intelligent systems through hands-on projects and research.',
        faculty_name: 'Dr. Kavita Joshi'
      }
    ];

    await Society.insertMany(societies);
    console.log(`✅ Created ${societies.length} societies`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up societies:', error);
    process.exit(1);
  }
}

setupSocieties();
