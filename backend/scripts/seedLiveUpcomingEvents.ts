import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ieee_events';

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

// ── LIVE EVENTS (happening right now — Feb 25, 2026) ──
const liveEvents = [
  {
    title: 'IEEE Hackathon 2026 — Code for Impact',
    description: 'A 48-hour hackathon where teams build solutions for social good. Tracks include Healthcare, Education, Sustainability, and Smart Cities. Live mentoring from industry experts.',
    start_time: new Date('2026-02-24T09:00:00+05:30'),
    end_time: new Date('2026-02-26T09:00:00+05:30'),
    location: 'Innovation Hub, Campus 6',
    registration_link: 'https://ieeestudentbranchkiit.in/hackathon2026',
  },
  {
    title: 'AI & Data Science Workshop — Day 2',
    description: 'Intensive 3-day workshop covering data preprocessing, model training with scikit-learn, and deploying ML models with FastAPI. Today: Deep Learning with PyTorch.',
    start_time: new Date('2026-02-24T10:00:00+05:30'),
    end_time: new Date('2026-02-26T17:00:00+05:30'),
    location: 'Seminar Hall 2, Campus 15',
  },
  {
    title: 'IEEE Tech Talk Marathon',
    description: 'Back-to-back lightning talks by student researchers covering quantum computing, edge AI, 6G networks, and autonomous systems. Followed by a networking mixer.',
    start_time: new Date('2026-02-25T09:00:00+05:30'),
    end_time: new Date('2026-02-25T20:00:00+05:30'),
    location: 'Auditorium, Campus 6',
  },
];

// ── UPCOMING EVENTS (scheduled for the future) ──
const upcomingEvents = [
  {
    title: 'Spring Fest — IEEE Cultural & Tech Night',
    description: 'A fusion of tech exhibitions, robotics demos, cultural performances, and a DJ night. The biggest IEEE social event of the semester.',
    start_time: new Date('2026-03-15T16:00:00+05:30'),
    end_time: new Date('2026-03-15T23:00:00+05:30'),
    location: 'KIIT Lawn, Campus 6',
    registration_link: 'https://ieeestudentbranchkiit.in/springfest',
  },
  {
    title: 'Full-Stack Development Bootcamp (MERN)',
    description: 'A 5-day intensive bootcamp covering MongoDB, Express, React, and Node.js. Build and deploy a production-ready web app by the end of the week.',
    start_time: new Date('2026-03-20T09:00:00+05:30'),
    end_time: new Date('2026-03-24T17:00:00+05:30'),
    location: 'Computer Lab 2, Campus 15',
    registration_link: 'https://ieeestudentbranchkiit.in/mern-bootcamp',
  },
  {
    title: 'IEEE International Conference on Emerging Tech (ICET)',
    description: 'A prestigious 2-day conference with paper presentations, poster sessions, and keynotes from IEEE Fellows. Topics: AI, IoT, Quantum Computing, and Green Energy.',
    start_time: new Date('2026-04-05T09:00:00+05:30'),
    end_time: new Date('2026-04-06T18:00:00+05:30'),
    location: 'KIIT Convention Centre, Campus 6',
    registration_link: 'https://ieeestudentbranchkiit.in/icet2026',
  },
  {
    title: 'Capture The Flag (CTF) — CyberSec Challenge',
    description: 'An online CTF competition with challenges in cryptography, reverse engineering, web exploitation, and forensics. Prizes worth ₹50,000 for top 3 teams.',
    start_time: new Date('2026-04-12T10:00:00+05:30'),
    end_time: new Date('2026-04-12T22:00:00+05:30'),
    location: 'Online (CTFd Platform)',
    registration_link: 'https://ieeestudentbranchkiit.in/ctf2026',
  },
  {
    title: 'Drone Workshop & Flying Competition',
    description: 'Learn to build and program drones from scratch, followed by an obstacle course flying competition. Drones and components provided by IEEE KIIT.',
    start_time: new Date('2026-04-25T09:00:00+05:30'),
    end_time: new Date('2026-04-26T16:00:00+05:30'),
    location: 'Robotics Lab, Campus 12',
    registration_link: 'https://ieeestudentbranchkiit.in/dronelab',
  },
  {
    title: 'IEEE Student Professional Awareness Conference (SPAC)',
    description: 'A career-focused conference with resume workshops, mock interviews, LinkedIn optimization, and talks by alumni working at Google, Microsoft, and Amazon.',
    start_time: new Date('2026-05-10T10:00:00+05:30'),
    end_time: new Date('2026-05-10T17:00:00+05:30'),
    location: 'Auditorium, Campus 6',
    registration_link: 'https://ieeestudentbranchkiit.in/spac2026',
  },
  {
    title: 'Open Source Contributor Summit',
    description: 'A full-day event teaching Git workflows, open-source etiquette, and how to make meaningful contributions. Hands-on session contributing to real IEEE open-source projects.',
    start_time: new Date('2026-05-22T09:30:00+05:30'),
    end_time: new Date('2026-05-22T17:00:00+05:30'),
    location: 'Seminar Hall 1, Campus 15',
    registration_link: 'https://ieeestudentbranchkiit.in/opensource',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const liveResult = await Event.insertMany(liveEvents);
    console.log(`🔴 LIVE — Inserted ${liveResult.length} events:`);
    liveResult.forEach((e, i) => console.log(`   ${i + 1}. ${e.title}`));

    const upcomingResult = await Event.insertMany(upcomingEvents);
    console.log(`\n🟢 UPCOMING — Inserted ${upcomingResult.length} events:`);
    upcomingResult.forEach((e, i) => console.log(`   ${i + 1}. ${e.title}`));

    console.log(`\n✅ Total inserted: ${liveResult.length + upcomingResult.length} events`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
