import { login } from '../src/services/authService';
import { createSociety, deleteSociety, getSocieties, updateSociety } from '../src/services/societyService';

async function verifyAdminDashboard() {
  try {
    console.log('--- Verifying Authentication ---');
    const token = await login('ieeekiitstudentbaranch@gmail.com', 'Mandalp166#');
    if (token) {
      console.log('Login successful! Token received.');
    } else {
      console.error('Login failed.');
      process.exit(1);
    }

    console.log('\n--- Verifying Society CRUD ---');
    
    // Create
    console.log('Creating new society...');
    const newSociety = await createSociety({
      name: 'Test Society',
      logo_url: '/test.png',
      chair_name: 'Test Chair',
      description: 'Test Description',
      faculty_name: 'Test Faculty'
    });
    console.log('Society created with ID:', newSociety.id);

    // Read
    const societies = await getSocieties();
    const createdSociety = societies.find(s => s.id === newSociety.id);
    if (createdSociety) {
      console.log('Society found in list:', createdSociety.name);
    } else {
      console.error('Society not found in list.');
    }

    // Update
    console.log('Updating society...');
    const updateResult = await updateSociety(newSociety.id, { name: 'Updated Test Society' });
    if (updateResult) {
      console.log('Society updated successfully.');
    } else {
      console.error('Society update failed.');
    }

    // Delete
    console.log('Deleting society...');
    const deleteResult = await deleteSociety(newSociety.id);
    if (deleteResult) {
      console.log('Society deleted successfully.');
    } else {
      console.error('Society delete failed.');
    }

    console.log('\n--- Verification Completed ---');

  } catch (error) {
    console.error('Verification failed with error:', error);
  } finally {
    process.exit(0);
  }
}

verifyAdminDashboard();
