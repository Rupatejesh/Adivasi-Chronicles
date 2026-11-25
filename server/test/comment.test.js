import assert from 'node:assert/strict';
import test from 'node:test';
import mongoose from 'mongoose';
import Comment from '../models/Comment.js';

// In-memory fixtures only; no comments or related documents are saved.
const fixture = () => ({
  post: new mongoose.Types.ObjectId(),
  author: new mongoose.Types.ObjectId(),
  content: '  Model QA  ',
});

test('Comment trims content and supplies defaults', async () => {
  const comment = new Comment(fixture());
  await comment.validate();
  assert.equal(comment.content, 'Model QA');
  assert.equal(comment.parentComment, null);
  assert.deepEqual([...comment.likes], []);
  assert.equal(comment.isEdited, false);
  assert.equal(comment.isActive, true);
});

test('Comment requires post, author and nonblank content', async () => {
  for (const field of ['post', 'author', 'content']) {
    for (const value of [undefined, null, ...(field === 'content' ? ['', '   '] : [])]) {
      await assert.rejects(new Comment({ ...fixture(), [field]: value }).validate(),
        error => error?.errors[field]?.kind === 'required');
    }
  }
});

test('Comment enforces the 2000-character content boundary after trimming', async () => {
  await new Comment({ ...fixture(), content: `  ${'a'.repeat(2000)}  ` }).validate();
  await assert.rejects(new Comment({ ...fixture(), content: 'a'.repeat(2001) }).validate(),
    error => error?.errors.content?.kind === 'maxlength');
});

test('Comment references Post, User and parent Comment and validates ObjectIds', async () => {
  for (const [field, ref] of [['post', 'Post'], ['author', 'User'], ['parentComment', 'Comment']]) {
    assert.equal(Comment.schema.path(field).instance, 'ObjectId');
    assert.equal(Comment.schema.path(field).options.ref, ref);
    await assert.rejects(new Comment({ ...fixture(), [field]: 'invalid-id' }).validate(),
      error => error?.errors[field]?.name === 'CastError');
  }
  assert.equal(Comment.schema.path('likes').getEmbeddedSchemaType().options.ref, 'User');
  const parent = new mongoose.Types.ObjectId();
  const user = new mongoose.Types.ObjectId();
  const reply = new Comment({ ...fixture(), parentComment: parent, likes: [user], isEdited: true, isActive: false });
  await reply.validate();
  assert.ok(reply.parentComment.equals(parent));
  assert.ok(reply.likes[0].equals(user));
  assert.equal(reply.isEdited, true);
  assert.equal(reply.isActive, false);
  assert.equal(new Comment(fixture()).likes.length, 0);
  await assert.rejects(new Comment({ ...fixture(), likes: ['invalid-id'] }).validate());
});

test('Comment configures Mongoose timestamps and reuses the compiled model', async () => {
  assert.equal(Comment.schema.options.timestamps, true);
  for (const field of ['createdAt', 'updatedAt']) {
    assert.equal(Comment.schema.path(field).instance, 'Date');
  }
  const { default: reloaded } = await import('../models/Comment.js?reload-check');
  assert.equal(reloaded, Comment);
});
