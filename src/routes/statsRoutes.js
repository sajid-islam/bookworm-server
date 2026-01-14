import express from 'express';
import verifyAdmin from '../middleware/verifyAdmin.middleware.js';
import verifyToken from '../middleware/verifyToken.middleware.js';
import { Book } from '../model/Book.js';
import { Genre } from '../model/Genre.js';
import { Review } from '../model/Review.js';
import { Tutorial } from '../model/Tutorial.js';
import { User } from '../model/User.js';

const router = express.Router();

router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [booksCount, usersCount, reviewsCount, genresCount, tutorialsCount] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments(),
      Review.countDocuments(),
      Genre.countDocuments(),
      Tutorial.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        books: booksCount,
        users: usersCount,
        reviews: reviewsCount,
        genres: genresCount,
        tutorials: tutorialsCount,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;
