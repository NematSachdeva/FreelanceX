const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Support both mobile app and web formats
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required']
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer is required']
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller is required']
  },
  requirements: {
    type: String,
    required: [true, 'Project requirements are required']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled', 'disputed'],
    default: 'pending'
  },
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String
    },
    reviewedAt: {
      type: Date
    }
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: 0
  },
  deliveryDate: {
    type: Date,
    required: [true, 'Delivery date is required']
  },
  deliverables: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'paypal', 'bank-transfer', 'crypto'],
    default: 'credit-card'
  }
}, {
  timestamps: true
});

// Virtual for backward compatibility
orderSchema.virtual('review').get(function() {
  return this.rating?.review;
});

orderSchema.virtual('review').set(function(value) {
  if (!this.rating) this.rating = {};
  this.rating.review = value;
});

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { virtuals: true });

// Pre-save middleware to sync duplicate fields for compatibility
orderSchema.pre('save', function(next) {
  // Sync service fields
  if (this.service && !this.serviceId) {
    this.serviceId = this.service;
  } else if (this.serviceId && !this.service) {
    this.service = this.serviceId;
  }
  
  // Sync buyer/client fields
  if (this.buyer && !this.clientId) {
    this.clientId = this.buyer;
  } else if (this.clientId && !this.buyer) {
    this.buyer = this.clientId;
  }
  
  // Sync seller/freelancer fields
  if (this.seller && !this.freelancerId) {
    this.freelancerId = this.seller;
  } else if (this.freelancerId && !this.seller) {
    this.seller = this.freelancerId;
  }
  
  next();
});

// Index for better query performance
orderSchema.index({ buyer: 1 });
orderSchema.index({ seller: 1 });
orderSchema.index({ clientId: 1 });
orderSchema.index({ freelancerId: 1 });
orderSchema.index({ service: 1 });
orderSchema.index({ serviceId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);