import { executeQuery } from '../src/config/db';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

async function setupAdmins() {
  const sqlPath = path.join(__dirname, '../database/admins.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  // Split SQL commands by semicolon
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
    }
  }

  // Seed Admin User
  const adminConfig = {
    name: 'Pritam',
    email: 'ieeekiitstudentbaranch@gmail.com',
    password: 'Mandalp166#',
    phone_no: '9832956892',
  };

  try {
    const hashedPassword = await bcrypt.hash(adminConfig.password, 10);
    const insertQuery = `
      INSERT INTO admins (name, email, password_hash, phone_no)
      VALUES (?, ?, ?, ?)
    `;
    await executeQuery(insertQuery, [
      adminConfig.name,
      adminConfig.email,
      hashedPassword,
      adminConfig.phone_no,
    ]);
    console.log('Admin user seeded successfully.');
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }

  console.log('Admin setup completed.');
  process.exit(0);
}

setupAdmins();
