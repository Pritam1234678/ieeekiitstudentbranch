async function checkEvents() {
  try {
    const res = await fetch('http://localhost:5000/api/events');
    const data = await res.json();
    
    if (data.success && data.data.length > 0) {
      const event = data.data[0];
      console.log('Event structure:', Object.keys(event));
      console.log('Has id:', 'id' in event);
      console.log('Has _id:', '_id' in event);
    } else {
      console.log('No events found to check');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkEvents();
