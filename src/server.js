import { configDotenv } from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';

const app = express();
configDotenv();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hey developer, Noting here on root');
});

app.listen(port, () => {
  connectDB();
  console.log(`BOOKWORM SERVER RUNNING ON PORT  ${port}`);
});
