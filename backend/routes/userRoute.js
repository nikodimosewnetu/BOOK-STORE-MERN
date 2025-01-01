import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { sendEmail } from '../mailer.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isConfirmed: false, // Add this field to your User schema
    });

    const emailToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d', // Token valid for 1 day
    });

    const confirmUrl = `${process.env.CLIENT_URL}/confirm-email/${emailToken}`;

    await sendEmail(
      email,
      'Confirm your email',
      `Please confirm your email by clicking the link: ${confirmUrl}`,
      `<p>Please confirm your email by clicking the link below:</p>
       <a href="${confirmUrl}">${confirmUrl}</a>`
    );

    res.status(201).json({ message: 'User created successfully. Please confirm your email.', newUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isConfirmed) {
      return res.status(403).json({ message: 'Please confirm your email before logging in' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

  router.get('/confirm-email/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.isConfirmed) {
        return res.status(400).json({ message: 'Email is already confirmed' });
      }
  
      user.isConfirmed = true;
      await user.save();
  
      res.status(200).json({ message: 'Email confirmed successfully' });
    } catch (error) {
      console.error('Email confirmation error:', error);
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  });
  
export default router;
