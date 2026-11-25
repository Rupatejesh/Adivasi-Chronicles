import assert from 'node:assert/strict';
import test from 'node:test';
import Category from '../models/Category.js';

// In-memory fixtures only: these tests never connect to MongoDB or save documents.
const fixture = () => ({ name: '  Category QA  ', slug: '  CATEGORY-QA  ' });

test('Category normalizes fields and supplies defaults', async () => {
  const category = new Category(fixture());
  await category.validate();
  assert.equal(category.name, 'Category QA');
  assert.equal(category.slug, 'category-qa');
  assert.equal(category.description, '');
  assert.equal(category.type, 'general');
  assert.equal(category.isActive, true);
  assert.equal(new Category({ ...fixture(), description: '  Notes  ' }).description, 'Notes');
  assert.equal(new Category({ ...fixture(), isActive: false }).isActive, false);
});

test('Category requires nonblank name and slug', async () => {
  for (const field of ['name', 'slug']) {
    for (const value of [undefined, null, '', '   ']) {
      await assert.rejects(new Category({ ...fixture(), [field]: value }).validate(),
        error => error?.errors[field]?.kind === 'required');
    }
  }
});

test('Category accepts all twelve types and rejects unknown types', async () => {
  for (const type of ['blog', 'history', 'biography', 'books', 'constitution', 'rights',
    'itda', 'schemes', 'music', 'gallery', 'journey', 'general']) {
    await new Category({ ...fixture(), type }).validate();
  }
  for (const type of ['unknown', 'BLOG', '']) {
    await assert.rejects(new Category({ ...fixture(), type }).validate(),
      error => error?.errors.type?.kind === 'enum');
  }
});

test('Category enforces the description length boundary', async () => {
  await new Category({ ...fixture(), description: 'a'.repeat(1000) }).validate();
  await assert.rejects(new Category({ ...fixture(), description: 'a'.repeat(1001) }).validate(),
    error => error?.errors.description?.kind === 'maxlength');
});

test('Category declares separate unique indexes and Mongoose timestamps', () => {
  for (const field of ['name', 'slug']) {
    assert.ok(Category.schema.indexes().some(([fields, options]) =>
      fields[field] === 1 && Object.keys(fields).length === 1 && options.unique));
  }
  assert.equal(Category.schema.options.timestamps, true);
  for (const field of ['createdAt', 'updatedAt']) {
    assert.equal(Category.schema.path(field).instance, 'Date');
  }
});

test('Category reload reuses the compiled model', async () => {
  const { default: reloaded } = await import('../models/Category.js?reload-check');
  assert.equal(reloaded, Category);
});
