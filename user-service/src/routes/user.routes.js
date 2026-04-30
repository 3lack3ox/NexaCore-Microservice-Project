const express = require('express');
const router = express.Router();
const {
  createProfile,
  getMyProfile,
  updateProfile,
  deleteProfile,
  getAllProfiles,
  getProfileById,
  deactivateProfile,
} = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// User routes (protected)
router.post('/', verifyToken, createProfile);
router.get('/me', verifyToken, getMyProfile);
router.put('/me', verifyToken, updateProfile);
router.delete('/me', verifyToken, deleteProfile);

// Admin routes (protected + admin only)
router.get('/', verifyToken, isAdmin, getAllProfiles);
router.get('/:userId', verifyToken, isAdmin, getProfileById);
router.patch('/:userId/deactivate', verifyToken, isAdmin, deactivateProfile);

module.exports = router;