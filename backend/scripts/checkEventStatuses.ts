import { Event } from '../src/models/event';
import { connectDB } from '../src/config/db';

async function checkEventStatuses() {
  try {
    await connectDB();
    
    const now = new Date();
    console.log('Current time:', now.toISOString());
    console.log('');
    
    const events = await Event.find().sort({ start_time: 1 });
    
    console.log(`Total events: ${events.length}\n`);
    
    events.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title}`);
      console.log(`   Start: ${event.start_time.toISOString()}`);
      console.log(`   End:   ${event.end_time.toISOString()}`);
      console.log(`   Status: ${event.status}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkEventStatuses();
