import dotenv from 'dotenv';
import app from './src/app.js';
import { connectDatabase, disconnectDatabase } from './src/config/db.js';

dotenv.config({ path: new URL('./.env', import.meta.url), quiet: true });

const port = Number(process.env.PORT ?? 5000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}

let server;
let stopping = false;

async function shutdown(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  setTimeout(() => process.exit(1), 5000).unref();
  try {
    if (server?.listening) await new Promise(resolve => server.close(resolve));
    await disconnectDatabase();
    process.exitCode = exitCode;
  } catch {
    console.error('Unable to close the database connection cleanly.');
    process.exitCode = 1;
  }
}

process.once('SIGINT', () => shutdown());
process.once('SIGTERM', () => shutdown());

try {
  await connectDatabase();
  if (!stopping) {
    server = app.listen(port, (error) => {
      if (!error) console.log(`Adivasi Chronicles API running on port ${port}`);
    });
    server.on('error', (error) => {
      const reason = error.code === 'EADDRINUSE' ? 'PORT is already in use' : 'check PORT and local network permissions';
      console.error(`Unable to start API: ${reason}.`);
      void shutdown(1);
    });
  }
} catch (error) {
  console.error(error.message);
  await shutdown(1);
}
