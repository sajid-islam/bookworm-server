import cookieParser from 'cookie-parser';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';

import bookRoutes from './routes/bookRoutes.js';
import genreRoutes from './routes/genreRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import tutorialRoutes from './routes/tutorialRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
configDotenv();
const port = process.env.PORT || 3001;
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use('/user', userRoutes);
app.use('/book', bookRoutes);
app.use('/genre', genreRoutes);
app.use('/review', reviewRoutes);
app.use('/tutorial', tutorialRoutes);

app.get('/', (req, res) => {
  res.send('Hey developer, Noting here on root');
});

app.listen(port, () => {
  connectDB();
  console.log(`BOOKWORM SERVER RUNNING ON PORT  ${port}`);
});
