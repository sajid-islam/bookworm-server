import express from 'express';
import cloudinary from '../config/cloudinary.js';
import { generateToken } from '../lib/generateToken.js';
import verifyToken from '../middleware/verifyToken.middleware.js';
import { User } from '../model/User.js';

const router = express.Router();

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  sameSite: isProduction ? 'none' : 'strict',
  secure: isProduction ? true : false,
  httpOnly: true,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

router.get('/me', verifyToken, async (req, res) => {
  const email = req.user.email;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Hmm… this user doesn’t exist anymore' });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error on getting /me(user)', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/me/role', verifyToken, async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById({ _id: userId }).select('role');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ role: user.role });
  } catch (error) {
    console.error('Error on getting /me/role(user)', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/register', async (req, res) => {
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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ message: 'Nice try, But we can’t email a ghost. Please add your email!' });
    }

    if (!password) {
      return res.status(400).json({
        message: 'Password not found. Hackers are celebrating',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Wrong credentials' });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(404).json({ message: 'Wrong credentials' });
    }

    const token = generateToken({ email });
    res
      .cookie('token', token, cookieOptions)
      .status(200)
      .json({
        user: { _id: user._id, name: user.name, email: user.email, photo: user.photo },
      });
  } catch (error) {
    console.error('Error on login to a user', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/logout', async (req, res) => {
  return res
    .clearCookie('token', { ...cookieOptions, maxAge: 0 })
    .status(200)
    .json({ message: 'Successfully logout ' });
});

export default router;
