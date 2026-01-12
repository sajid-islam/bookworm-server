import express from 'express';
import { User } from '../model/User.js';

const router = express.Router();

router.post('/registration', async (req, res) => {
  const { name, email, photo, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All filed are required' });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ message: 'User already exist by this email' });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();
    res.status(201).json({ user: { _id: newUser._id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    console.error('Error on registering a user', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
