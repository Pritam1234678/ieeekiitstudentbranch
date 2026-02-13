import { executeQuery } from '../src/config/db';
import fs from 'fs';
import path from 'path';

async function setupSocieties() {
  const sqlPath = path.join(__dirname, '../database/societies.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  // Split SQL commands by semicolon (simple split, might need improvement for complex SQL)
  // Ignoring empty statements
  const statements = sql
    .split(';')
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0);

  console.log(`Found ${statements.length} SQL statements to execute.`);

  for (const statement of statements) {
    try {
      await executeQuery(statement);
      console.log('Executed SQL statement successfully.');
    } catch (error) {
      console.error('Error executing SQL statement:', error);
      console.error('Statement:', statement);
    }
  }

  console.log('Society setup completed.');
  process.exit(0);
}

setupSocieties();
