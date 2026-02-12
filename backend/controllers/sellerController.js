const { validationResult } = require('express-validator');
const User = require('../models/User');

// Become a seller
const becomeSeller = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, bio } = req.body;
    const userId = req.user._id;

    // Check if user is already a seller
    const user = await User.findById(userId);
    if (user.role === 'freelancer') {
      return res.status(400).json({ message: 'You are already a freelancer' });
    }

    // Update user to become a freelancer
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        role: 'freelancer',
        'profile.bio': bio,
        name: name
      },
      { new: true, runValidators: true }
    );

    // Update localStorage data would need to be handled on frontend
    res.json({
      message: 'Successfully became a freelancer!',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profile: updatedUser.profile
      }
    });
  } catch (error) {
    console.error('Become seller error:', error);
    res.status(500).json({ message: 'Server error becoming a seller' });
  }
};

module.exports = {
  becomeSeller
};