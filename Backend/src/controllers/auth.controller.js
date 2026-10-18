const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('token', token, {
    httpOnly: true, // It saves froms XSS attacks (frontend js cannot access this cookie)
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Its saves from CSRF attacks (its prevents other sites from making requests to your site)
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
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
    secure: process.env.NODE_ENV === 'production', // NODE_ENV means - have 2 optuons: development or production. devlopment means local development. production means live environment.
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, loginUser, logoutUser };
