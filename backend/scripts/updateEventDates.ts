import { Event } from '../src/models/event';
import { connectDB } from '../src/config/db';

async function updateEventDates() {
  try {
    await connectDB();
    console.log('🔄 Updating event dates for proper status distribution...\n');

    // Clear existing events
    await Event.deleteMany({});
    console.log('✅ Cleared existing events');

    // Current date: 2026-02-16
    const now = new Date('2026-02-16T00:00:00');

    // Create events with different statuses
    const events = [
      // PAST EVENTS (2 events)
      {
        title: 'Robotics Workshop 2026',
        image_url: 'https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?w=800',
        description: 'Hands-on robotics workshop with Arduino and ROS.',
        start_time: new Date('2026-01-05T10:00:00'),
        end_time: new Date('2026-01-07T16:00:00')
      },
      {
        title: 'AI/ML Guest Lecture',
        image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        description: 'Diving deep into Machine Learning and Artificial Intelligence applications.',
        start_time: new Date('2026-02-12T15:00:00'),
        end_time: new Date('2026-02-12T17:00:00')
      },
      
      // LIVE EVENT (1 event - happening now)
      {
        title: 'IEEE Tech Summit 2026',
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        description: 'Annual technology summit featuring AI, IoT, and emerging tech trends.',
        start_time: new Date('2026-02-15T09:00:00'),
        end_time: new Date('2026-02-18T18:00:00')
      },
      
      // UPCOMING EVENTS (2 events)
      {
        title: 'Web Development Workshop',
        image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        description: 'Hands-on workshop covering modern web development with React and Next.js.',
        start_time: new Date('2026-02-20T14:00:00'),
        end_time: new Date('2026-02-28T17:00:00')
      },
      {
        title: 'Hackathon: Code for Change',
        image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        description: '24-hour hackathon focused on solving real-world problems with technology.',
        start_time: new Date('2026-03-07T18:00:00'),
        end_time: new Date('2026-03-08T18:00:00')
      }
    ];

    await Event.insertMany(events);
    console.log(`✅ Created ${events.length} events with mixed statuses`);
    
    // Verify status distribution
    const pastCount = await Event.countDocuments({ end_time: { $lt: now } });
    const liveCount = await Event.countDocuments({ 
      start_time: { $lte: now }, 
      end_time: { $gte: now } 
    });
    const upcomingCount = await Event.countDocuments({ start_time: { $gt: now } });
    
    console.log('\n📊 Event Status Distribution:');
    console.log(`   Past: ${pastCount}`);
    console.log(`   Live: ${liveCount}`);
    console.log(`   Upcoming: ${upcomingCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating events:', error);
    process.exit(1);
  }
}

updateEventDates();
