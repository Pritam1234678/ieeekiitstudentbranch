import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ieee_events';

const EventSchema = new mongoose.Schema({ title: { type: String } });
const Event = mongoose.model('Event', EventSchema);

const titlesToDelete = [
  'TechVista 2025 — Annual Technical Symposium',
  'Workshop on Machine Learning & Neural Networks',
  'IEEE Day Celebration 2025',
  'CyberSec Summit — Ethical Hacking Bootcamp',
  'Robotics & IoT Innovation Challenge',
  'Web3 & Blockchain Seminar',
  'Women in Engineering (WIE) Leadership Summit',
  'CodeSprint — Competitive Programming Contest',
  'Cloud Computing Workshop with AWS',
  'Research Paper Writing & Publishing Workshop'
];

async function remove() {
  try {
    await mongoose.connect(MONGO_URI);
    const result = await Event.deleteMany({ title: { $in: titlesToDelete } });
    console.log(`✅ Deleted ${result.deletedCount} dummy events.`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

remove();
