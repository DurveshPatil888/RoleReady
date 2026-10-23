const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hash,
    });

    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: 'User registered successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      generateTokenAndSetCookie(res, user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: 'Logged in successfully',
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Token Not Found' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User DB me nahi mila!' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('GetCurrentUser Error:', error.message);
    res.status(500).json({ message: 'Invalid token ya server error!' });
  }
};

module.exports = { registerUser, loginUser, logoutUser, getCurrentUser };
