import assert from 'node:assert/strict';
import test from 'node:test';
import mongoose from 'mongoose';
import Biography from '../models/Biography.js';

// Schema fixtures only: no real people, historical claims, quotations or citations.
const fixture = () => ({ name: '  Model QA  ', slug: '  MODEL-QA  ', summary: '  Validation fixture only.  ' });

test('Biography normalizes required text and supplies conservative defaults', async () => {
  const entry = new Biography(fixture());
  await entry.validate();
  assert.equal(entry.name, 'Model QA');
  assert.equal(entry.slug, 'model-qa');
  assert.equal(entry.summary, 'Validation fixture only.');
  for (const field of ['biography', 'portrait', 'region', 'community']) assert.equal(entry[field], '');
  for (const field of ['birthDate', 'deathDate', 'lastVerifiedAt', 'author']) assert.equal(entry[field], null);
  for (const field of ['alternateNames', 'categories', 'keyContributions', 'sources', 'quotations']) {
    assert.deepEqual([...entry[field]], []);
  }
  assert.equal(entry.verificationStatus, 'pending');
  assert.equal(entry.isFeatured, false);
  assert.equal(entry.isPublished, false);
});

test('Biography requires nonblank identity and summary and enforces length limits', async () => {
  for (const [field, limit] of [['name', 150], ['slug', 180], ['summary', 1000]]) {
    for (const value of [undefined, null, '', '   ']) {
      await assert.rejects(new Biography({ ...fixture(), [field]: value }).validate(),
        error => error?.errors[field]?.kind === 'required');
    }
    await new Biography({ ...fixture(), [field]: 'a'.repeat(limit) }).validate();
    await assert.rejects(new Biography({ ...fixture(), [field]: 'a'.repeat(limit + 1) }).validate(),
      error => error?.errors[field]?.kind === 'maxlength');
  }
});

test('Biography validates editorial status without automatically verifying quotations', async () => {
  for (const verificationStatus of ['pending', 'reviewed', 'verified']) {
    const entry = new Biography({ ...fixture(), verificationStatus, quotations: [{}] });
    await entry.validate();
    assert.equal(entry.quotations[0].verified, false);
    assert.equal(entry.lastVerifiedAt, null);
    assert.equal(entry.isPublished, false);
  }
  await assert.rejects(new Biography({ ...fixture(), verificationStatus: 'approved' }).validate(),
    error => error?.errors.verificationStatus?.kind === 'enum');
});

test('Biography embeds source and quotation metadata without fabricated evidence', async () => {
  const source = Biography.schema.path('sources').schema;
  const quotation = Biography.schema.path('quotations').schema;
  for (const [schema, fields] of [[source, ['title', 'publisher', 'url']],
    [quotation, ['text', 'sourceTitle', 'sourceUrl', 'verificationNote']]]) {
    assert.equal(schema.options._id, false);
    for (const field of fields) {
      assert.equal(schema.path(field).instance, 'String');
      assert.equal(schema.path(field).options.trim, true);
    }
  }
  assert.equal(source.path('accessedAt').instance, 'Date');
  assert.equal(quotation.path('verified').instance, 'Boolean');
  const entry = new Biography({ ...fixture(), sources: [{}], quotations: [{}] });
  await entry.validate();
  assert.deepEqual(entry.sources[0].toObject(), {});
  assert.deepEqual(entry.quotations[0].toObject(), { verified: false });
  await assert.rejects(new Biography({ ...fixture(), sources: [{ accessedAt: 'invalid-date' }] }).validate(),
    error => error?.errors['sources.0.accessedAt']?.name === 'CastError');
});

test('Biography supports arrays, trimmed context and optional User author', async () => {
  const author = new mongoose.Types.ObjectId();
  const entry = new Biography({ ...fixture(), alternateNames: ['  QA alias  '],
    region: '  QA region  ', community: '  QA community  ', categories: ['QA'],
    keyContributions: ['Schema fixture'], author, isFeatured: true, isPublished: true });
  await entry.validate();
  assert.deepEqual([...entry.alternateNames], ['QA alias']);
  assert.equal(entry.region, 'QA region');
  assert.equal(entry.community, 'QA community');
  assert.deepEqual([...entry.categories], ['QA']);
  assert.deepEqual([...entry.keyContributions], ['Schema fixture']);
  assert.ok(entry.author.equals(author));
  assert.equal(entry.isFeatured, true);
  assert.equal(entry.isPublished, true);
  assert.equal(Biography.schema.path('author').options.ref, 'User');
  assert.equal(Biography.schema.path('author').instance, 'ObjectId');
  await assert.rejects(new Biography({ ...fixture(), author: 'invalid-id' }).validate(),
    error => error?.errors.author?.name === 'CastError');
});

test('Biography rejects invalid dates and declares unique slug and timestamps', async () => {
  for (const field of ['birthDate', 'deathDate', 'lastVerifiedAt']) {
    await assert.rejects(new Biography({ ...fixture(), [field]: 'invalid-date' }).validate(),
      error => error?.errors[field]?.name === 'CastError');
  }
  assert.ok(Biography.schema.indexes().some(([fields, options]) => fields.slug === 1 && options.unique));
  assert.equal(Biography.schema.options.timestamps, true);
  for (const field of ['createdAt', 'updatedAt']) assert.equal(Biography.schema.path(field).instance, 'Date');
  const { default: reloaded } = await import('../models/Biography.js?reload-check');
  assert.equal(reloaded, Biography);
});
