import express from 'express';
import cloudinary from '../config/cloudinary.js';
import { generateToken } from '../lib/generateToken.js';
import { User } from '../model/User.js';

const router = express.Router();

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  sameSite: isProduction ? 'none' : 'strict',
  secure: isProduction ? true : false,
  httpOnly: true,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

router.post('/registration', async (req, res) => {
  const { name, email, photoFile, password } = req.body;
  try {
    if (!name || !email || !password || !photoFile) {
      return res.status(400).json({ message: 'All filed are required' });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ message: 'User already exist by this email' });
    }

    const photoUploadRes = await cloudinary.uploader.upload(photoFile);
    const photoUrl = photoUploadRes.secure_url;

    const newUser = new User({
      name,
      email,
      password,
      photo: photoUrl,
    });

    await newUser.save();
    const token = generateToken({ email: newUser.email });
    res.cookie('token', token, cookieOptions);
    res.status(201).json({
      token,
      user: { _id: newUser._id, name: newUser.name, email: newUser.email, photo: photoUrl },
    });
  } catch (error) {
    console.error('Error on registering a user', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
