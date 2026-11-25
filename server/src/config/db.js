import mongoose from 'mongoose';

// Module-level listeners are registered once per Node process, not per call.
mongoose.connection.on('connected', () => console.log('MongoDB connected'));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));
mongoose.connection.on('error', () => console.error('MongoDB connection error; check the local service and MONGODB_URI.'));

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri?.trim()) {
    throw new Error('MONGODB_URI is required. Set it in server/.env.');
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  } catch {
    // Driver errors can contain the URI. Return only safe guidance.
    throw new Error('Unable to connect to MongoDB. Check the local MongoDB service and MONGODB_URI.');
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
