import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ieee_events';

// Event schema inline (to avoid import issues with ts-node paths)
const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image_url: { type: String },
    description: { type: String },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    location: { type: String },
    registration_link: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const Event = mongoose.model('Event', EventSchema);

const pastEvents = [
  {
    title: 'TechVista 2025 — Annual Technical Symposium',
    description: 'IEEE KIIT\'s flagship annual symposium featuring keynote talks from industry leaders, paper presentations, and a 24-hour hackathon with 500+ participants.',
    start_time: new Date('2025-11-15T09:00:00'),
    end_time: new Date('2025-11-16T18:00:00'),
    location: 'KIIT Convention Centre, Campus 6',
  },
  {
    title: 'Workshop on Machine Learning & Neural Networks',
    description: 'A hands-on 2-day workshop covering supervised learning, deep neural networks, and model deployment using TensorFlow and PyTorch. Open to all branches.',
    start_time: new Date('2025-10-05T10:00:00'),
    end_time: new Date('2025-10-06T16:00:00'),
    location: 'Seminar Hall 3, Campus 15',
  },
  {
    title: 'IEEE Day Celebration 2025',
    description: 'Celebrating the global IEEE Day with tech quizzes, coding challenges, a panel discussion on "The Future of 6G", and networking sessions for members.',
    start_time: new Date('2025-10-01T11:00:00'),
    end_time: new Date('2025-10-01T17:00:00'),
    location: 'Auditorium, Campus 6',
  },
  {
    title: 'CyberSec Summit — Ethical Hacking Bootcamp',
    description: 'An intensive bootcamp on penetration testing, network security, and CTF competitions. Participants learned offensive and defensive security techniques from certified experts.',
    start_time: new Date('2025-09-12T09:30:00'),
    end_time: new Date('2025-09-13T17:30:00'),
    location: 'Computer Lab 4, Campus 15',
  },
  {
    title: 'Robotics & IoT Innovation Challenge',
    description: 'A 48-hour build challenge where teams designed and programmed Arduino/Raspberry Pi-based robots and IoT solutions for real-world problems. Top 3 teams received cash prizes.',
    start_time: new Date('2025-08-20T08:00:00'),
    end_time: new Date('2025-08-22T18:00:00'),
    location: 'Innovation Lab, Campus 12',
  },
  {
    title: 'Web3 & Blockchain Seminar',
    description: 'Industry experts from Polygon and Ethereum Foundation discussed decentralized applications, smart contract security, and the future of blockchain technology.',
    start_time: new Date('2025-07-18T14:00:00'),
    end_time: new Date('2025-07-18T18:00:00'),
    location: 'Virtual (Microsoft Teams)',
  },
  {
    title: 'Women in Engineering (WIE) Leadership Summit',
    description: 'An inspiring summit featuring talks by accomplished women engineers, mentorship speed-dating sessions, and a panel on breaking barriers in STEM careers.',
    start_time: new Date('2025-06-08T10:00:00'),
    end_time: new Date('2025-06-08T16:30:00'),
    location: 'KIIT Auditorium, Campus 6',
  },
  {
    title: 'CodeSprint — Competitive Programming Contest',
    description: 'A 5-hour competitive programming contest on Codeforces with 300+ participants. Problems ranged from beginner to advanced, with prizes for the top 10 solvers.',
    start_time: new Date('2025-05-25T10:00:00'),
    end_time: new Date('2025-05-25T15:00:00'),
    location: 'Online (Codeforces)',
  },
  {
    title: 'Cloud Computing Workshop with AWS',
    description: 'A workshop conducted in collaboration with AWS Academy covering EC2, S3, Lambda, and serverless architectures. Participants received AWS credits and certificates.',
    start_time: new Date('2025-04-10T09:00:00'),
    end_time: new Date('2025-04-11T17:00:00'),
    location: 'Seminar Hall 1, Campus 15',
  },
  {
    title: 'Research Paper Writing & Publishing Workshop',
    description: 'A session on writing IEEE-format research papers, understanding peer review, and navigating IEEE Xplore for publishing. Led by faculty from KIIT\'s R&D department.',
    start_time: new Date('2025-03-22T11:00:00'),
    end_time: new Date('2025-03-22T15:00:00'),
    location: 'Library Conference Room, Campus 6',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Event.insertMany(pastEvents);
    console.log(`\n🎉 Successfully inserted ${result.length} past events:\n`);

    result.forEach((event, i) => {
      console.log(`  ${i + 1}. ${event.title}`);
    });

    console.log('\n✅ Done! All events have end_time in the past, so they will show as PAST status.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
