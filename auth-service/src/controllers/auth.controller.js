const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Register
const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, role });

    return res.status(201).json({
      message: 'User registered successfully',
      userId: user.id,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

// Logout (client-side token removal, but we acknowledge it)
const logout = (req, res) => {
  return res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { register, login, getMe, logout };