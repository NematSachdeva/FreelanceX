const { validationResult } = require('express-validator');
const Service = require('../models/Service');

// Get all services
const getAllServices = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const services = await Service.find(query)
      .populate('createdBy', 'name email profile role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Service.countDocuments(query);

    // Transform services for Android app compatibility
    const transformedServices = services.map(service => {
      const serviceObj = service.toObject();
      
      // Ensure freelancer data is in the correct format for Android
      if (serviceObj.createdBy) {
        serviceObj.freelancer = {
          _id: serviceObj.createdBy._id,
          name: serviceObj.createdBy.name,
          email: serviceObj.createdBy.email,
          role: serviceObj.createdBy.role || 'freelancer',
          rating: serviceObj.createdBy.profile?.rating || serviceObj.createdBy.rating || 0,
          profilePhoto: serviceObj.createdBy.profile?.avatar || serviceObj.createdBy.profile?.profilePhoto || null
        };
        
        // Keep createdBy for website compatibility
        // Don't delete it to avoid breaking website
      }
      
      return serviceObj;
    });

    res.json({
      services: transformedServices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Server error fetching services' });
  }
};

// Get services by category
const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const services = await Service.find({ category, isActive: true })
      .populate('createdBy', 'name email profile role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Service.countDocuments({ category, isActive: true });

    // Transform services for Android app compatibility
    const transformedServices = services.map(service => {
      const serviceObj = service.toObject();
      
      // Ensure freelancer data is in the correct format for Android
      if (serviceObj.createdBy) {
        serviceObj.freelancer = {
          _id: serviceObj.createdBy._id,
          name: serviceObj.createdBy.name,
          email: serviceObj.createdBy.email,
          role: serviceObj.createdBy.role || 'freelancer',
          rating: serviceObj.createdBy.profile?.rating || serviceObj.createdBy.rating || 0,
          profilePhoto: serviceObj.createdBy.profile?.avatar || serviceObj.createdBy.profile?.profilePhoto || null
        };
      }
      
      return serviceObj;
    });

    res.json({
      services: transformedServices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get services by category error:', error);
    res.status(500).json({ message: 'Server error fetching services by category' });
  }
};

// Get single service
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('createdBy', 'name email profile role');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const serviceObj = service.toObject();
    
    // Ensure freelancer data is in the correct format for Android
    if (serviceObj.createdBy) {
      serviceObj.freelancer = {
        _id: serviceObj.createdBy._id,
        name: serviceObj.createdBy.name,
        email: serviceObj.createdBy.email,
        role: serviceObj.createdBy.role || 'freelancer',
        rating: serviceObj.createdBy.profile?.rating || serviceObj.createdBy.rating || 0,
        profilePhoto: serviceObj.createdBy.profile?.avatar || serviceObj.createdBy.profile?.profilePhoto || null
      };
    }

    res.json(serviceObj);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ message: 'Server error fetching service' });
  }
};

// Create new service
const createService = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('❌ Service validation errors:', JSON.stringify(errors.array(), null, 2));
      console.error('📦 Received data:', JSON.stringify(req.body, null, 2));
      return res.status(400).json({ 
        message: errors.array()[0].msg,
        errors: errors.array() 
      });
    }

    const serviceData = {
      ...req.body,
      createdBy: req.user._id,
      freelancerId: req.user._id  // Add freelancerId field
    };

    const service = new Service(serviceData);
    await service.save();

    const populatedService = await Service.findById(service._id)
      .populate('createdBy', 'name email profile.avatar');

    const serviceObj = populatedService.toObject();
    
    // Add freelancer field for Android compatibility
    if (serviceObj.createdBy) {
      serviceObj.freelancer = {
        _id: serviceObj.createdBy._id,
        name: serviceObj.createdBy.name,
        email: serviceObj.createdBy.email,
        role: serviceObj.createdBy.role || 'freelancer',
        rating: serviceObj.createdBy.profile?.rating || serviceObj.createdBy.rating || 0,
        profilePhoto: serviceObj.createdBy.profile?.avatar || serviceObj.createdBy.profile?.profilePhoto || null
      };
    }

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: serviceObj,
      service: serviceObj // Keep for backward compatibility
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server error creating service' });
  }
};

// Update service
const updateService = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if user owns the service
    if (service.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email profile.avatar');

    res.json({
      message: 'Service updated successfully',
      service: updatedService
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server error updating service' });
  }
};

// Delete service
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if user owns the service
    if (service.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this service' });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server error deleting service' });
  }
};

// Get user's own services
const getMyServices = async (req, res) => {
  try {
    console.log('📋 Getting services for user:', req.user._id);
    
    const { page = 1, limit = 100 } = req.query;
    
    // Find services created by the authenticated user
    const query = { createdBy: req.user._id };
    
    const services = await Service.find(query)
      .populate('createdBy', 'name email profile role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Service.countDocuments(query);

    console.log(`✅ Found ${services.length} services for user ${req.user._id}`);

    // Transform services for Android app compatibility
    const transformedServices = services.map(service => {
      const serviceObj = service.toObject();
      
      // Ensure freelancer data is in the correct format for Android
      if (serviceObj.createdBy) {
        serviceObj.freelancer = {
          _id: serviceObj.createdBy._id,
          name: serviceObj.createdBy.name,
          email: serviceObj.createdBy.email,
          role: serviceObj.createdBy.role || 'freelancer',
          rating: serviceObj.createdBy.profile?.rating || serviceObj.createdBy.rating || 0,
          profilePhoto: serviceObj.createdBy.profile?.avatar || serviceObj.createdBy.profile?.profilePhoto || null
        };
      }
      
      return serviceObj;
    });

    res.json({
      services: transformedServices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('❌ Get my services error:', error);
    res.status(500).json({ message: 'Server error fetching your services' });
  }
};

// Log that schema sync is complete
console.log('✅ Service Controller: Freelancer schema transformation enabled');
console.log('   - Services now include "freelancer" field for Android compatibility');
console.log('   - "createdBy" field preserved for website compatibility');

module.exports = {
  getAllServices,
  getServicesByCategory,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getMyServices
};