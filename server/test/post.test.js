import assert from 'node:assert/strict';
import test from 'node:test';
import mongoose from 'mongoose';
import Post from '../models/Post.js';

// In-memory validation only. No content or related documents are saved.
const fixture = () => ({
  title: '  Model QA  ', slug: '  MODEL-QA  ', content: 'Schema validation fixture only.',
  author: new mongoose.Types.ObjectId(), category: new mongoose.Types.ObjectId(),
});

test('Post normalizes text and defaults to an unfeatured draft', async () => {
  const post = new Post(fixture());
  await post.validate();
  assert.equal(post.title, 'Model QA');
  assert.equal(post.slug, 'model-qa');
  assert.equal(post.excerpt, '');
  assert.equal(post.coverImage, '');
  assert.equal(post.status, 'draft');
  assert.equal(post.isFeatured, false);
  assert.equal(post.publishedAt, null);
  for (const field of ['tags', 'sources', 'likes']) assert.equal(post[field].length, 0);
});

test('Post requires title, slug, content, author and category', async () => {
  for (const field of ['title', 'slug', 'content', 'author', 'category']) {
    for (const value of [undefined, null, ...(['title', 'slug', 'content'].includes(field) ? [''] : [])]) {
      await assert.rejects(new Post({ ...fixture(), [field]: value }).validate(),
        error => error?.errors[field]?.kind === 'required');
    }
  }
  for (const field of ['title', 'slug']) {
    await assert.rejects(new Post({ ...fixture(), [field]: '   ' }).validate(),
      error => error?.errors[field]?.kind === 'required');
  }
});

test('Post validates status and text length boundaries', async () => {
  for (const status of ['draft', 'published']) await new Post({ ...fixture(), status }).validate();
  await assert.rejects(new Post({ ...fixture(), status: 'archived' }).validate(),
    error => error?.errors.status?.kind === 'enum');
  for (const [field, limit] of [['title', 200], ['excerpt', 500]]) {
    await new Post({ ...fixture(), [field]: 'a'.repeat(limit) }).validate();
    await assert.rejects(new Post({ ...fixture(), [field]: 'a'.repeat(limit + 1) }).validate(),
      error => error?.errors[field]?.kind === 'maxlength');
  }
});

test('Post trims tags and excerpt and stores optional publication metadata', async () => {
  const date = new Date('2026-09-30T00:00:00Z');
  const post = new Post({ ...fixture(), tags: ['  qa  ', ' model '], excerpt: '  QA  ',
    publishedAt: date, isFeatured: true });
  await post.validate();
  assert.deepEqual([...post.tags], ['qa', 'model']);
  assert.equal(post.excerpt, 'QA');
  assert.equal(post.publishedAt.getTime(), date.getTime());
  assert.equal(post.isFeatured, true);
  assert.equal(new Post(fixture()).tags.length, 0);
});

test('Post embeds optional source fields without invented references', async () => {
  const schema = Post.schema.path('sources').schema;
  for (const field of ['title', 'url', 'publisher']) {
    assert.equal(schema.path(field).instance, 'String');
    assert.equal(schema.path(field).options.trim, true);
  }
  assert.equal(schema.path('accessedAt').instance, 'Date');
  assert.equal(schema.options._id, false);
  // Empty metadata exercises the structure without fabricating a citation.
  const post = new Post({ ...fixture(), sources: [{}] });
  await post.validate();
  assert.deepEqual(post.sources[0].toObject(), {});
  await assert.rejects(new Post({ ...fixture(), sources: [{ accessedAt: 'invalid-date' }] }).validate(),
    error => error?.errors['sources.0.accessedAt']?.name === 'CastError');
});

test('Post references User and Category and validates ObjectIds', async () => {
  for (const [field, ref] of [['author', 'User'], ['category', 'Category']]) {
    assert.equal(Post.schema.path(field).instance, 'ObjectId');
    assert.equal(Post.schema.path(field).options.ref, ref);
    await assert.rejects(new Post({ ...fixture(), [field]: 'invalid-id' }).validate(),
      error => error?.errors[field]?.name === 'CastError');
  }
  assert.equal(Post.schema.path('likes').getEmbeddedSchemaType().options.ref, 'User');
  const id = new mongoose.Types.ObjectId();
  const post = new Post({ ...fixture(), likes: [id] });
  await post.validate();
  assert.ok(post.likes[0].equals(id));
  await assert.rejects(new Post({ ...fixture(), likes: ['invalid-id'] }).validate());
});

test('Post declares a unique slug index, timestamps and safe model reload', async () => {
  assert.ok(Post.schema.indexes().some(([fields, options]) => fields.slug === 1 && options.unique));
  assert.equal(Post.schema.options.timestamps, true);
  for (const field of ['createdAt', 'updatedAt']) assert.equal(Post.schema.path(field).instance, 'Date');
  const { default: reloaded } = await import('../models/Post.js?reload-check');
  assert.equal(reloaded, Post);
});
