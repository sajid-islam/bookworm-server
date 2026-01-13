import express from 'express';
import cloudinary from '../config/cloudinary.js';
import verifyAdmin from '../middleware/verifyAdmin.middleware.js';
import verifyToken from '../middleware/verifyToken.middleware.js';
import { Book } from '../model/Book.js';
import { Genre } from '../model/Genre.js';

const router = express.Router();

router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { title, author, genre, description, coverFile } = req.body;

  try {
    if (!title || !author || !genre || !description || !coverFile) {
      return res.status(400).json({
        message: 'Book without details? That’s just blank pages',
      });
    }

    const genreExists = await Genre.findById(genre);
    if (!genreExists) {
      return res.status(404).json({ message: 'Selected genre does not exist' });
    }

    const coverUploadRes = await cloudinary.uploader.upload(coverFile);
    const coverUrl = coverUploadRes.secure_url;

    const book = await Book.create({
      title,
      author,
      genre,
      description,
      coverImage: coverUrl,
    });

    res.status(201).json({ message: 'Book created successfully', book });
  } catch (error) {
    console.error('Error creating book', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const books = await Book.find({ isDeleted: false })
      .populate('genre', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ books });
  } catch (error) {
    console.error('Error fetching books', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
