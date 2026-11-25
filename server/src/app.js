import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import biographyRoutes from './routes/biographyRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import knowledgeRoutes from './routes/knowledgeRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import songRoutes from './routes/songRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import journeyRoutes from './routes/journeyRoutes.js';
import favouriteRoutes from './routes/favouriteRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Adivasi Chronicles API' });
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/biographies', biographyRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
