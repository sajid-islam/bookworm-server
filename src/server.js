import cors from 'cors';
import { configDotenv } from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';

import bookRoutes from './routes/bookRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
configDotenv();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/user', userRoutes);
app.use('/book', bookRoutes);

app.get('/', (req, res) => {
  res.send('Hey developer, Noting here on root');
});

app.listen(port, () => {
  connectDB();
  console.log(`BOOKWORM SERVER RUNNING ON PORT  ${port}`);
});
