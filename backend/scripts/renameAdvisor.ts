import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('MONGO_URI not set'); process.exit(1); }

async function run() {
  await mongoose.connect(MONGO_URI as string);
  const db = mongoose.connection.db!;
  const col = db.collection('members');

  const result = await col.updateMany(
    { position: 'Faculty Advisor' },
    { $set: { position: 'Advisor' } }
  );
  console.log(`Renamed ${result.modifiedCount} "Faculty Advisor" → "Advisor".`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
