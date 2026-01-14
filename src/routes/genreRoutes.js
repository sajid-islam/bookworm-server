import express from 'express';
import verifyAdmin from '../middleware/verifyAdmin.middleware.js';
import verifyToken from '../middleware/verifyToken.middleware.js';
import { Genre } from '../model/Genre.js';

const router = express.Router();

router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({
        message: 'Genre without a name? That’s just chaos',
      });
    }

    const exists = await Genre.findOne({ name: name.trim() });
    if (exists) {
      return res.status(409).json({ message: 'Genre already exists' });
    }

    const genre = await Genre.create({
      name: name.trim(),
    });

    res.status(201).json({ message: 'Genre created successfully', genre });
  } catch (error) {
    console.error('Error creating genre', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const genres = await Genre.find();
    res.status(200).json({ genres });
  } catch (error) {
    console.error('Error fetching genres', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const genreId = req.params.id;
  try {
    const genre = await Genre.findById(genreId);

    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    res.status(200).json({ genre });
  } catch (error) {
    console.error('Error fetching genre', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { name } = req.body;
  const genreId = req.params.id;

  try {
    const genre = await Genre.findById(genreId);

    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    if (name) {
      const exists = await Genre.findOne({
        name: name.trim(),
      });

      if (exists) {
        return res.status(409).json({ message: 'Genre name already in use' });
      }

      genre.name = name.trim();
    }

    await genre.save();

    res.status(200).json({ message: 'Genre updated successfully', genre });
  } catch (error) {
    console.error('Error updating genre', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
