const User = require('../models/User');
const Service = require('../models/Service');

// Get all freelancers
const getAllFreelancers = async (req, res) => {
  try {
    const { page = 1, limit = 10, skills } = req.query;
    
    let query = { role: 'freelancer' };
    
    // Filter by skills if provided
    if (skills) {
      const skillsArray = skills.split(',');
      query['profile.skills'] = { $in: skillsArray };
    }

    const freelancers = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      freelancers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get freelancers error:', error);
    res.status(500).json({ message: 'Server error fetching freelancers' });
  }
};

// Get freelancer by ID
const getFreelancerById = async (req, res) => {
  try {
    const freelancer = await User.findById(req.params.id).select('-password');

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    // Get freelancer's services
    const services = await Service.find({ 
      createdBy: req.params.id, 
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({
      freelancer,
      services
    });
  } catch (error) {
    console.error('Get freelancer error:', error);
    res.status(500).json({ message: 'Server error fetching freelancer' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { 
      name, 
      avatar, 
      bio, 
      skills, 
      location, 
      socialLinks,
      profile 
    } = req.body;
    
    const updateData = {};
    
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;
    if (bio !== undefined) updateData.bio = bio;
    if (skills) updateData.skills = skills;
    if (location !== undefined) updateData.location = location;
    if (socialLinks) updateData.socialLinks = socialLinks;
    if (profile) updateData.profile = { ...req.user.profile, ...profile };
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// Get user profile by ID (public)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's services if freelancer
    let services = [];
    if (user.role === 'freelancer' || user.accountType === 'freelancer') {
      services = await Service.find({ 
        createdBy: req.params.id, 
        isActive: true 
      })
      .sort({ createdAt: -1 })
      .limit(6);
    }

    res.json({
      user,
      services,
      stats: {
        totalServices: services.length,
        rating: user.profile?.rating || 0,
        completedProjects: user.profile?.completedProjects || 0
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

module.exports = {
  getAllFreelancers,
  getFreelancerById,
  updateProfile,
  getCurrentUser,
  getUserProfile
};