import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import Category from '../../models/Category.js';
import User from '../../models/User.js';

dotenv.config({ path: new URL('../../.env', import.meta.url), quiet: true });

const defaultCategories = [
  { name: 'Tribal History', slug: 'tribal-history', type: 'history', description: 'Research-based essays on Adivasi history, movements and local memory.' },
  { name: 'Heroes & Rebels', slug: 'heroes-and-rebels', type: 'biography', description: 'Biographies of tribal leaders, resistance figures and social reformers.' },
  { name: 'Books & Ideas', slug: 'books-and-ideas', type: 'books', description: 'Reading notes, historical context and key social thought.' },
  { name: 'Constitution', slug: 'constitution', type: 'constitution', description: 'Constitutional articles, Fifth & Sixth Schedules and civic frameworks.' },
  { name: 'Tribal Rights', slug: 'tribal-rights', type: 'rights', description: 'PESA, Forest Rights Act, SC/ST protections and Gram Sabha governance.' },
  { name: 'ITDA & Development', slug: 'itda-development', type: 'itda', description: 'Educational notes on ITDA institutions and regional development.' },
  { name: 'Schemes & Funds', slug: 'schemes-and-funds', type: 'schemes', description: 'Verified information on public tribal development programmes.' },
  { name: 'Culture & Memory', slug: 'culture-and-memory', type: 'blog', description: 'Personal essays, reflections and cultural documentation.' },
  { name: 'Eastern Ghats', slug: 'eastern-ghats', type: 'gallery', description: 'Landscapes, hills and community spaces across the Eastern Ghats.' },
  { name: 'My Journey', slug: 'my-journey', type: 'journey', description: 'Personal learning, Horses / Horse Riding, Football and Archery.' },
];

async function runSeed() {
  await connectDatabase();
  try {
    let createdCategories = 0;
    for (const item of defaultCategories) {
      const existing = await Category.findOne({ slug: item.slug });
      if (!existing) {
        await Category.create(item);
        createdCategories += 1;
      }
    }
    console.log(`Categories verified (${createdCategories} created, ${defaultCategories.length - createdCategories} already present).`);

    const adminEmail = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_SEED_PASSWORD;
    const adminName = process.env.ADMIN_SEED_NAME?.trim() || 'Archive Administrator';

    if (adminEmail && adminPassword) {
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        await User.create({
          name: adminName,
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
        });
        console.log(`Admin account created for ${adminEmail}.`);
      } else {
        console.log(`Admin account already exists for ${adminEmail}.`);
      }
    } else {
      console.log('No ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD set; skipped admin creation.');
    }
  } finally {
    await disconnectDatabase();
  }
}

runSeed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
