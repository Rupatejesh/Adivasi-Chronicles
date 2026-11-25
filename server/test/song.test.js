import assert from 'node:assert/strict';
import test from 'node:test';
import mongoose from 'mongoose';
import Song from '../models/Song.js';

// Generic in-memory validation fixtures, not commercial music metadata or seed data.
const fixture = () => ({ title: '  Model QA  ', artist: '  Validation fixture  ' });

test('Song trims identity fields and supplies metadata-only defaults', async () => {
  const song = new Song(fixture());
  await song.validate();
  assert.equal(song.title, 'Model QA');
  assert.equal(song.artist, 'Validation fixture');
  assert.equal(song.category, 'other');
  assert.equal(song.sourceType, 'metadata-only');
  for (const field of ['language', 'artwork', 'audioUrl', 'externalUrl']) assert.equal(song[field], '');
  assert.equal(song.duration, null);
  assert.deepEqual([...song.tags], []);
  assert.equal(song.isFeatured, false);
  assert.equal(song.isActive, true);
  assert.equal(song.addedBy, null);
});

test('Song requires nonblank title and artist and limits each to 200 characters', async () => {
  for (const field of ['title', 'artist']) {
    for (const value of [undefined, null, '', '   ']) {
      await assert.rejects(new Song({ ...fixture(), [field]: value }).validate(),
        error => error?.errors[field]?.kind === 'required');
    }
    await new Song({ ...fixture(), [field]: 'a'.repeat(200) }).validate();
    await assert.rejects(new Song({ ...fixture(), [field]: 'a'.repeat(201) }).validate(),
      error => error?.errors[field]?.kind === 'maxlength');
  }
});

test('Song accepts every category and source type and rejects invalid values', async () => {
  for (const [field, values] of [
    ['category', ['ambedkar', 'tribal-folk', 'kesari', 'prabhas', 'allu-arjun', 'other']],
    ['sourceType', ['owned', 'licensed', 'external', 'metadata-only']],
  ]) {
    for (const value of values) await new Song({ ...fixture(), [field]: value }).validate();
    for (const value of ['unknown', '', values[0].toUpperCase()]) {
      await assert.rejects(new Song({ ...fixture(), [field]: value }).validate(),
        error => error?.errors[field]?.kind === 'enum');
    }
  }
});

test('Song accepts optional nonnegative duration and rejects negative duration', async () => {
  for (const duration of [null, 0, 0.5, 120]) await new Song({ ...fixture(), duration }).validate();
  await assert.rejects(new Song({ ...fixture(), duration: -0.1 }).validate(),
    error => error?.errors.duration?.kind === 'min');
  await assert.rejects(new Song({ ...fixture(), duration: 'invalid-number' }).validate(),
    error => error?.errors.duration?.name === 'CastError');
});

test('Song trims language and tags and supports explicit flags and addedBy', async () => {
  const user = new mongoose.Types.ObjectId();
  const song = new Song({ ...fixture(), language: '  QA  ', tags: ['  qa  ', ' fixture '],
    addedBy: user, isFeatured: true, isActive: false });
  await song.validate();
  assert.equal(song.language, 'QA');
  assert.deepEqual([...song.tags], ['qa', 'fixture']);
  assert.ok(song.addedBy.equals(user));
  assert.equal(song.isFeatured, true);
  assert.equal(song.isActive, false);
  assert.equal(new Song(fixture()).tags.length, 0);
  assert.equal(Song.schema.path('addedBy').instance, 'ObjectId');
  assert.equal(Song.schema.path('addedBy').options.ref, 'User');
  await assert.rejects(new Song({ ...fixture(), addedBy: 'invalid-id' }).validate(),
    error => error?.errors.addedBy?.name === 'CastError');
});

test('Song has timestamps, no per-user favourites field and safe model reload', async () => {
  assert.equal(Song.schema.options.timestamps, true);
  for (const field of ['createdAt', 'updatedAt']) assert.equal(Song.schema.path(field).instance, 'Date');
  for (const field of ['favourites', 'favorites', 'isFavourite']) assert.equal(Song.schema.path(field), undefined);
  const { default: reloaded } = await import('../models/Song.js?reload-check');
  assert.equal(reloaded, Song);
});
