import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('MONGO_URI not set'); process.exit(1); }

const SKIP_POSITIONS = ['Chair', 'Faculty Advisor', 'Counselor'];

async function run() {
  await mongoose.connect(MONGO_URI as string);
  const db = mongoose.connection.db!;
  const col = db.collection('members');

  // Add domain: "" to members that don't have it yet, skipping leadership
  const result = await col.updateMany(
    { position: { $nin: SKIP_POSITIONS }, domain: { $exists: false } },
    { $set: { domain: '' } }
  );

  console.log(`Updated ${result.modifiedCount} members with domain field.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
