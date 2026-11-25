import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import app from '../src/app.js';
import User from '../models/User.js';

const TEST_DB_URI = 'mongodb://127.0.0.1:27017/adivasi_chronicles_test';

async function withServer(run) {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await run(base);
  } finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
}

async function apiJson(base, path, { method = 'GET', token, body } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(base + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  return { status: response.status, data };
}

test('Full MERN REST API: auth, roles, blog, comments, archives, copyright guard, search, contact', async () => {
  await mongoose.connect(TEST_DB_URI, { serverSelectionTimeoutMS: 5000 });
  await mongoose.connection.dropDatabase();

  try {
    await withServer(async (base) => {
      // 1. Register normal user (never returns password; cannot self-assign admin)
      const reg = await apiJson(base, '/api/auth/register', {
        method: 'POST',
        body: { name: 'Visitor Reader', email: 'reader@example.invalid', password: 'password123', role: 'admin' },
      });
      assert.equal(reg.status, 201);
      assert.ok(reg.data.token);
      assert.equal(reg.data.user.role, 'user');
      assert.equal(reg.data.user.password, undefined);
      const userToken = reg.data.token;

      // 2. Create admin directly in test DB and login
      const adminHash = await bcrypt.hash('adminpass123', 10);
      await User.create({
        name: 'Archive Admin',
        email: 'admin@example.invalid',
        password: adminHash,
        role: 'admin',
      });
      const login = await apiJson(base, '/api/auth/login', {
        method: 'POST',
        body: { email: 'admin@example.invalid', password: 'adminpass123' },
      });
      assert.equal(login.status, 200);
      assert.equal(login.data.user.role, 'admin');
      const adminToken = login.data.token;

      // 3. Normal user cannot create category
      const forbiddenCat = await apiJson(base, '/api/categories', {
        method: 'POST',
        token: userToken,
        body: { name: 'Forbidden', type: 'blog' },
      });
      assert.equal(forbiddenCat.status, 403);

      // 4. Admin creates category
      const catRes = await apiJson(base, '/api/categories', {
        method: 'POST',
        token: adminToken,
        body: { name: 'Culture & Memory', type: 'blog' },
      });
      assert.equal(catRes.status, 201);
      const categoryId = catRes.data.category._id;

      // 5. Draft post is hidden from public and global search, visible to admin
      const draftRes = await apiJson(base, '/api/posts', {
        method: 'POST',
        token: adminToken,
        body: {
          title: 'Unpublished Draft Essay',
          content: 'Draft notes pending review.',
          category: categoryId,
          status: 'draft',
        },
      });
      assert.equal(draftRes.status, 201);
      const draftSlug = draftRes.data.post.slug;

      const publicListBefore = await apiJson(base, '/api/posts');
      assert.equal(publicListBefore.data.posts.length, 0);

      const publicDraftFetch = await apiJson(base, `/api/posts/slug/${draftSlug}`);
      assert.equal(publicDraftFetch.status, 404);

      const searchDraft = await apiJson(base, '/api/search?q=Unpublished');
      assert.equal(searchDraft.data.results.length, 0);

      // 6. Publish post, user likes and comments, edits own comment
      const pubRes = await apiJson(base, '/api/posts', {
        method: 'POST',
        token: adminToken,
        body: {
          title: 'Eastern Ghats Field Notes',
          excerpt: 'Reflections from the hills.',
          content: 'Detailed field notes with references.',
          category: categoryId,
          tags: ['eastern-ghats', 'memory'],
          status: 'published',
        },
      });
      assert.equal(pubRes.status, 201);
      const postId = pubRes.data.post._id;

      const likeRes = await apiJson(base, `/api/posts/${postId}/like`, {
        method: 'POST',
        token: userToken,
      });
      assert.equal(likeRes.status, 200);
      assert.equal(likeRes.data.liked, true);
      assert.equal(likeRes.data.likesCount, 1);

      const commentRes = await apiJson(base, '/api/comments', {
        method: 'POST',
        token: userToken,
        body: { post: postId, content: 'Thoughtful notes!' },
      });
      assert.equal(commentRes.status, 201);
      const commentId = commentRes.data.comment._id;

      const editComment = await apiJson(base, `/api/comments/${commentId}`, {
        method: 'PUT',
        token: userToken,
        body: { content: 'Thoughtful notes — updated!' },
      });
      assert.equal(editComment.status, 200);
      assert.equal(editComment.data.comment.isEdited, true);

      // 7. Song copyright policy: reject direct audioUrl for commercial/external sourceType
      const badSong = await apiJson(base, '/api/songs', {
        method: 'POST',
        token: adminToken,
        body: {
          title: 'Commercial Track',
          artist: 'Artist Name',
          category: 'other',
          sourceType: 'external',
          audioUrl: 'https://example.invalid/commercial.mp3',
        },
      });
      assert.equal(badSong.status, 400);

      const validSong = await apiJson(base, '/api/songs', {
        method: 'POST',
        token: adminToken,
        body: {
          title: 'Community Folk Recording',
          artist: 'Archive Owner',
          category: 'tribal-folk',
          sourceType: 'owned',
          audioUrl: '/audio/sample.mp3',
        },
      });
      assert.equal(validSong.status, 201);

      // 8. Favourites toggle
      const favToggle = await apiJson(base, '/api/favourites/toggle', {
        method: 'POST',
        token: userToken,
        body: { itemType: 'song', itemId: validSong.data.song._id },
      });
      assert.equal(favToggle.status, 201);
      assert.equal(favToggle.data.saved, true);

      const favList = await apiJson(base, '/api/favourites', { token: userToken });
      assert.equal(favList.data.favourites.length, 1);

      // 9. Knowledge, Biography, Book, Scheme, Gallery, Journey & Global Search
      await apiJson(base, '/api/biographies', {
        method: 'POST',
        token: adminToken,
        body: {
          name: 'Birsa Munda',
          slug: 'birsa-munda',
          summary: 'Referenced biographical entry.',
          isPublished: true,
        },
      });
      await apiJson(base, '/api/books', {
        method: 'POST',
        token: adminToken,
        body: {
          title: 'Gulamgiri',
          slug: 'gulamgiri',
          author: 'Jyotirao Phule',
          overview: 'Reading notes overview.',
          isPublished: true,
        },
      });
      await apiJson(base, '/api/knowledge', {
        method: 'POST',
        token: adminToken,
        body: {
          title: 'Fifth Schedule Overview',
          slug: 'fifth-schedule',
          section: 'constitution',
          summary: 'Constitutional provisions for Scheduled Areas.',
          isPublished: true,
        },
      });
      await apiJson(base, '/api/schemes', {
        method: 'POST',
        token: adminToken,
        body: {
          name: 'Post-Matric Scholarship',
          slug: 'post-matric-scholarship',
          department: 'Tribal Welfare Department',
          purpose: 'Educational scholarship information.',
          officialSource: 'Official portal reference',
          relevantYear: '2025-26',
          isPublished: true,
        },
      });
      await apiJson(base, '/api/journey', {
        method: 'POST',
        token: adminToken,
        body: {
          title: 'Morning Archery Practice',
          interest: 'archery',
          summary: 'Initial reflection on focus and posture.',
          isPublished: true,
        },
      });

      const globalSearch = await apiJson(base, '/api/search?q=Eastern');
      assert.equal(globalSearch.status, 200);
      assert.ok(globalSearch.data.results.some((r) => r.type === 'Blog'));

      // 10. Contact message submission & admin stats
      const contactRes = await apiJson(base, '/api/contact', {
        method: 'POST',
        body: {
          name: 'Community Contributor',
          email: 'contributor@example.invalid',
          subject: 'Sources & References',
          message: 'Sharing an archival citation for review.',
        },
      });
      assert.equal(contactRes.status, 201);

      const statsRes = await apiJson(base, '/api/admin/stats', { token: adminToken });
      assert.equal(statsRes.status, 200);
      assert.equal(statsRes.data.stats.publishedPosts, 1);
      assert.equal(statsRes.data.stats.draftPosts, 1);
      assert.equal(statsRes.data.stats.unreadMessages, 1);
    });
  } finally {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});
