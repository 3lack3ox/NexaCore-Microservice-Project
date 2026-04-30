const Profile = require('../models/profile.model');

// Create user profile
const createProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, bio, avatarUrl } = req.body;
    const userId = req.user.id;

    const existing = await Profile.findOne({ where: { userId } });
    if (existing) {
      return res.status(409).json({ message: 'Profile already exists for this user' });
    }

    const profile = await Profile.create({
      userId,
      firstName,
      lastName,
      phone,
      address,
      bio,
      avatarUrl,
    });

    return res.status(201).json({
      message: 'Profile created successfully',
      profile,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create profile', error: err.message });
  }
};

// Get own profile
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { userId: req.user.id } });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    return res.status(200).json(profile);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

// Update own profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, bio, avatarUrl } = req.body;

    const profile = await Profile.findOne({ where: { userId: req.user.id } });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    await profile.update({ firstName, lastName, phone, address, bio, avatarUrl });

    return res.status(200).json({
      message: 'Profile updated successfully',
      profile,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

// Delete own profile
const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { userId: req.user.id } });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    await profile.destroy();
    return res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete profile', error: err.message });
  }
};

// Admin: Get all profiles
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.findAll();
    return res.status(200).json(profiles);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch profiles', error: err.message });
  }
};

// Admin: Get profile by userId
const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { userId: req.params.userId } });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    return res.status(200).json(profile);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

// Admin: Deactivate a user profile
const deactivateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { userId: req.params.userId } });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    await profile.update({ isActive: false });
    return res.status(200).json({ message: 'Profile deactivated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to deactivate profile', error: err.message });
  }
};

module.exports = {
  createProfile,
  getMyProfile,
  updateProfile,
  deleteProfile,
  getAllProfiles,
  getProfileById,
  deactivateProfile,
};