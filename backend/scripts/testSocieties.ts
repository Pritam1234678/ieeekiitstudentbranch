import { getSocieties, getSocietyCount } from '../src/services/societyService';

async function testSocieties() {
  try {
    console.log('Fetching societies...');
    const societies = await getSocieties();
    console.log('Societies:', JSON.stringify(societies, null, 2));

    console.log('Fetching society count...');
    const count = await getSocietyCount();
    console.log('Society Count:', count);

    if (societies.length > 0 && count > 0) {
      console.log('Verification successful!');
    } else {
      console.error('Verification failed: No societies found.');
    }
  } catch (error) {
    console.error('Verification failed with error:', error);
  } finally {
    process.exit(0);
  }
}

testSocieties();
