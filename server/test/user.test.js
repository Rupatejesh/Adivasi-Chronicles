import assert from 'node:assert/strict';
import test from 'node:test';
import User from '../models/User.js';

// These fixtures are validated in memory only; no passwords or documents are saved.
const fixture = () => ({ name: '  Model QA  ', email: '  MODEL-QA@EXAMPLE.INVALID  ', password: 'in-memory-only' });

test('User normalizes identity fields and supplies community defaults', async () => {
  const user = new User(fixture());
  await user.validate();
  assert.equal(user.name, 'Model QA');
  assert.equal(user.email, 'model-qa@example.invalid');
  assert.equal(user.role, 'user');
  assert.equal(user.avatar, '');
  assert.equal(user.bio, '');
  assert.equal(user.isActive, true);
  assert.equal(User.schema.options.timestamps, true);
  assert.ok(User.schema.path('createdAt'));
  assert.ok(User.schema.path('updatedAt'));
  assert.equal(User.schema.path('password').options.select, false);
  assert.ok(User.schema.indexes().some(([fields, options]) => fields.email === 1 && options.unique));
});

test('User rejects missing or empty required fields', async () => {
  for (const field of ['name', 'email', 'password']) {
    for (const value of [undefined, '', ...(field === 'password' ? [] : ['   '])]) {
      const user = new User({ ...fixture(), [field]: value });
      await assert.rejects(user.validate(), error => error?.errors[field]?.kind === 'required');
    }
  }
});

test('User accepts defined roles and limits bio to 500 characters', async () => {
  for (const role of ['user', 'author', 'admin']) {
    await new User({ ...fixture(), role, bio: 'a'.repeat(500) }).validate();
  }
  await assert.rejects(new User({ ...fixture(), role: 'owner' }).validate(),
    error => error?.errors.role?.kind === 'enum');
  await assert.rejects(new User({ ...fixture(), bio: 'a'.repeat(501) }).validate(),
    error => error?.errors.bio?.kind === 'maxlength');
});

test('User can be imported again without duplicate model compilation', async () => {
  const { default: reloaded } = await import('../models/User.js?reload-check');
  assert.equal(reloaded, User);
});
