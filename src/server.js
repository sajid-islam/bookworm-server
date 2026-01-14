import cookieParser from 'cookie-parser';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';

import job from './lib/cron.js';
import bookRoutes from './routes/bookRoutes.js';
import genreRoutes from './routes/genreRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import tutorialRoutes from './routes/tutorialRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
configDotenv();
const port = process.env.PORT || 3001;

app.set('trust proxy', 1);

app.use(
  cors({ origin: ['http://localhost:3000', 'https://bookworm-new.vercel.app'], credentials: true })
);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/genre', genreRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/tutorial', tutorialRoutes);

job.start();

app.get('/', (req, res) => {
  res.send('Hey developer, Noting here on root');
});

app.listen(port, () => {
  connectDB();
  console.log(`BOOKWORM SERVER RUNNING ON PORT  ${port}`);
});
