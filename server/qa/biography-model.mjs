import assert from 'node:assert/strict';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../src/config/db.js';

dotenv.config({ path: new URL('../.env', import.meta.url), quiet: true });
// QA-only settings prevent automatic collection and index creation.
mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);

try {
  await connectDatabase();
  assert.equal(mongoose.connection.name, 'adivasi_chronicles');
  const collectionNames = async () => (await mongoose.connection.db
    .listCollections({}, { nameOnly: true }).toArray()).map(item => item.name).sort();
  const before = await collectionNames();
  const { default: Biography } = await import('../models/Biography.js');
  // An impossible filter checks database communication without retrieving real data.
  assert.equal(await Biography.findOne({ _id: { $exists: false } }), null);
  assert.deepEqual(await collectionNames(), before);
  console.log('PASS: Biography query reached MongoDB; no writes or collection changes.');
} catch {
  console.error('Biography model QA failed. Check the local database and model configuration.');
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
