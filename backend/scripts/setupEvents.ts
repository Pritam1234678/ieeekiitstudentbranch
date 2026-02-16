import { Event } from '../src/models/event';
import { connectDB } from '../src/config/db';

async function setupEvents() {
  try {
    await connectDB();
    console.log('🔄 Setting up events...');

    // Clear existing events
    await Event.deleteMany({});
    console.log('✅ Cleared existing events');

    // Create sample events
    const events = [
      {
        title: 'IEEE Tech Summit 2026',
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        description: 'Annual technology summit featuring AI, IoT, and emerging tech trends.',
        start_time: new Date('2026-02-02T09:00:00'),
        end_time: new Date('2026-02-04T18:00:00')
      },
      {
        title: 'Hackathon: Code for Change',
        image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        description: '24-hour hackathon focused on solving real-world problems with technology.',
        start_time: new Date('2026-02-07T18:00:00'),
        end_time: new Date('2026-02-08T18:00:00')
      },
      {
        title: 'Web Development Workshop',
        image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        description: 'Hands-on workshop covering modern web development with React and Next.js.',
        start_time: new Date('2026-02-20T14:00:00'),
        end_time: new Date('2026-02-28T17:00:00')
      },
      {
        title: 'AI/ML Guest Lecture',
        image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        description: 'Diving deep into Machine Learning and Artificial Intelligence applications.',
        start_time: new Date('2026-02-12T15:00:00'),
        end_time: new Date('2026-02-12T17:00:00')
      },
      {
        title: 'Robotics Workshop 2026',
        image_url: 'https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?w=800',
        description: 'Hands-on robotics workshop with Arduino and ROS.',
        start_time: new Date('2026-01-05T10:00:00'),
        end_time: new Date('2026-01-07T16:00:00')
      }
    ];

    await Event.insertMany(events);
    console.log(`✅ Created ${events.length} events`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up events:', error);
    process.exit(1);
  }
}

setupEvents();
