import assert from 'node:assert/strict';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../src/config/db.js';

dotenv.config({ path: new URL('../.env', import.meta.url), quiet: true });
// Verification-only settings prevent model initialization from creating collections/indexes.
mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);

try {
  await connectDatabase();
  assert.equal(mongoose.connection.name, 'adivasi_chronicles');
  const collections = () => mongoose.connection.db.listCollections({}, { nameOnly: true }).toArray();
  const before = await collections();
  const { default: User } = await import('../models/User.js');
  let excludesPassword = false;
  // Inspect query options only, never document contents or passwords.
  mongoose.set('debug', (collection, method, filter, options) => {
    if (collection === 'users' && method === 'findOne') {
      excludesPassword = options?.projection?.password === 0;
    }
  });
  // An impossible identifier filter exercises a normal query without reading user data.
  assert.equal(await User.findOne({ _id: { $exists: false } }), null);
  assert.equal(excludesPassword, true);
  assert.deepEqual(await collections(), before);
  console.log('PASS: User query reached MongoDB with password excluded; no writes or collection changes.');
} catch {
  console.error('User model QA failed. Check the local database and model configuration.');
  process.exitCode = 1;
} finally {
  mongoose.set('debug', false);
  await disconnectDatabase();
}
