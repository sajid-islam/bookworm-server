import express from 'express';
import verifyAdmin from '../middleware/verifyAdmin.middleware.js';
import verifyToken from '../middleware/verifyToken.middleware.js';
import { Book } from '../model/Book.js';
import { Review } from '../model/Review.js';

const router = express.Router();

router.post('/:bookId', verifyToken, async (req, res) => {
  const { rating, comment } = req.body;
  const { bookId } = req.params;

  try {
    if (!rating || !comment) {
      return res.status(400).json({
        message: 'Review without thoughts? Say something',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5',
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const alreadyReviewed = await Review.findOne({
      book: bookId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(409).json({
        message: 'You already reviewed this book',
      });
    }

    const review = await Review.create({
      book: bookId,
      user: req.user._id,
      rating,
      comment,
    });

    res.status(201).json({
      message: 'Review submitted and waiting for approval',
      review,
    });
  } catch (error) {
    console.error('Error submitting review', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/book/:bookId', verifyToken, async (req, res) => {
  try {
    const reviews = await Review.find({
      book: req.params.bookId,
      status: 'approved',
    })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/all', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('book', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.patch('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.status = status;
    await review.save();

    res.status(200).json({ message: `Review ${status}` });
  } catch (error) {
    console.error('Error approving review', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
