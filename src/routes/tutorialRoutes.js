import express from 'express';
import verifyAdmin from '../middleware/verifyAdmin.middleware.js';
import verifyToken from '../middleware/verifyToken.middleware.js';
import { Tutorial } from '../model/Tutorial.js';

const router = express.Router();

router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { title, description, youtubeUrl } = req.body;

  try {
    if (!title || !youtubeUrl) {
      return res.status(400).json({
        message: 'A tutorial without a video? Bold choice',
      });
    }

    const tutorial = await Tutorial.create({
      title,
      description,
      youtubeUrl,
    });

    res.status(201).json({
      message: 'Tutorial video added successfully',
      tutorial,
    });
  } catch (error) {
    console.error('Error adding tutorial', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const tutorials = await Tutorial.find({ isActive: true });

    res.status(200).json({ tutorials });
  } catch (error) {
    console.error('Error fetching tutorials', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/admin/all', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const tutorials = await Tutorial.find();
    res.status(200).json({ tutorials });
  } catch (error) {
    console.error('Error fetching admin tutorials', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { title, description, youtubeUrl, isActive } = req.body;
  const tutorialId = req.params.id;
  try {
    const tutorial = await Tutorial.findById(tutorialId);

    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    tutorial.title = title ?? tutorial.title;
    tutorial.description = description ?? tutorial.description;
    tutorial.youtubeUrl = youtubeUrl ?? tutorial.youtubeUrl;
    tutorial.isActive = isActive ?? tutorial.isActive;

    await tutorial.save();

    res.status(200).json({
      message: 'Tutorial updated successfully',
      tutorial,
    });
  } catch (error) {
    console.error('Error updating tutorial', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const tutorial = await Tutorial.findByIdAndDelete(req.params.id);

    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    res.status(200).json({ message: 'Tutorial deleted successfully' });
  } catch (error) {
    console.error('Error deleting tutorial', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
