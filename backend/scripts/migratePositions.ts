import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: MONGO_URI environment variable is not set.');
  process.exit(1);
}

async function migratePositions() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI as string);
    console.log('Connected.');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection failed");
    }
    
    const membersCollection = db.collection('members');

    console.log('Migrating Director to Counselor...');
    const result1 = await membersCollection.updateMany(
      { position: 'Director' },
      { $set: { position: 'Counselor' } }
    );
    console.log(`Updated ${result1.modifiedCount} documents from Director to Counselor.`);

    console.log('Migrating Faculty In Charge to Faculty Advisor...');
    const result2 = await membersCollection.updateMany(
      { position: 'Faculty In Charge' },
      { $set: { position: 'Faculty Advisor' } }
    );
    console.log(`Updated ${result2.modifiedCount} documents from Faculty In Charge to Faculty Advisor.`);

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Disconnected from database.');
    }
    process.exit(0);
  }
}

migratePositions();
