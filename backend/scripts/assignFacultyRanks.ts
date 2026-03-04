import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: MONGO_URI environment variable is not set.');
  process.exit(1);
}

async function assignFacultyRanks() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI as string);
    console.log('Connected.');

    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection failed');

    const membersCollection = db.collection('members');

    // Fetch all Faculty Advisors sorted by their insertion order (_id)
    const advisors = await membersCollection
      .find({ position: 'Faculty Advisor' })
      .sort({ _id: 1 }) // oldest first = rank 1
      .toArray();

    console.log(`Found ${advisors.length} Faculty Advisor(s).`);

    let assigned = 0;
    for (let i = 0; i < advisors.length; i++) {
      const rank = i + 1;
      await membersCollection.updateOne(
        { _id: advisors[i]._id },
        { $set: { rank } }
      );
      console.log(`  Assigned rank ${rank} to: ${advisors[i].fullname}`);
      assigned++;
    }

    console.log(`\nDone. ${assigned} Faculty Advisor(s) updated with ranks.`);
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

assignFacultyRanks();
