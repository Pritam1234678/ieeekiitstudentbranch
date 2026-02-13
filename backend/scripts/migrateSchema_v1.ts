import { executeQuery } from '../src/config/db';

async function migrate() {
  console.log('Starting migration: Replace source_url with faculty_name...');

  try {
    // 1. Add faculty_name column
    await executeQuery(`
      ALTER TABLE societies 
      ADD COLUMN faculty_name VARCHAR(255) DEFAULT 'random';
    `);
    console.log('Added faculty_name column.');

    // 2. Update existing rows (already handled by DEFAULT 'random', but explicit update is good practice if default wasn't set)
    await executeQuery(`
      UPDATE societies SET faculty_name = 'random' WHERE faculty_name IS NULL;
    `);
    console.log('Updated existing rows with default faculty_name.');

    // 3. Drop source_url column
    await executeQuery(`
      ALTER TABLE societies 
      DROP COLUMN source_url;
    `);
    console.log('Dropped source_url column.');

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

migrate();
