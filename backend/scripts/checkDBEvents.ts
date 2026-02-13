
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkEvents() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ieee_db',
  });

  try {
    const [rows] = await connection.execute('SELECT id, title, status, start_time FROM events');
    console.log('Current Events in DB:');
    console.table(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
  } finally {
    await connection.end();
  }
}

checkEvents();
