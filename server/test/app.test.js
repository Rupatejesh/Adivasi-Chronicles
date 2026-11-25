import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import express from 'express';
import app from '../src/app.js';
import errorHandler from '../src/middleware/errorHandler.js';

async function serve(application, run) {
  const server = application.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    await run(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
}

test('API endpoints, JSON 404, open CORS and malformed JSON', async () => {
  await serve(app, async (base) => {
    for (const [path, message] of [
      ['/', 'Adivasi Chronicles API'],
      ['/api/health', 'Adivasi Chronicles API is running'],
    ]) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200);
      assert.match(response.headers.get('content-type'), /application\/json/);
      assert.deepEqual(await response.json(), { success: true, message });
    }

    for (const path of ['/api/not-found', '/missing']) {
      const response = await fetch(base + path);
      assert.equal(response.status, 404);
      assert.deepEqual(await response.json(), { success: false, message: 'Route not found' });
    }

    const preflight = await fetch(base + '/api/health', {
      method: 'OPTIONS',
      headers: { Origin: 'https://example.org', 'Access-Control-Request-Method': 'GET' },
    });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get('access-control-allow-origin'), '*');

    const malformed = await fetch(base + '/api/health', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"private":"do not echo",',
    });
    assert.equal(malformed.status, 400);
    assert.deepEqual(await malformed.json(), { success: false, message: 'Invalid JSON request body' });
  });
});

test('production errors hide internal details (test-only route)', async () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  const fixture = express();
  fixture.get('/failure', () => { throw new Error('private internal details'); });
  fixture.use(errorHandler);
  try {
    await serve(fixture, async (base) => {
      const response = await fetch(base + '/failure');
      assert.equal(response.status, 500);
      assert.deepEqual(await response.json(), { success: false, message: 'Internal server error' });
    });
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
});
