const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Service description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'web-development',
      'mobile-development',
      'ui-ux-design',
      'graphic-design',
      'digital-marketing',
      'seo',
      'content-writing',
      'video-editing',
      'data-analysis',
      'consulting'
    ]
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  deliveryTime: {
    type: String,
    required: [true, 'Delivery time is required']
  },
  contactInfo: {
    type: String,
    required: false
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'
  },
  images: {
    type: [String],
    default: []
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  orders: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better search performance
serviceSchema.index({ title: 'text', description: 'text', tags: 'text' });
serviceSchema.index({ category: 1 });
serviceSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Service', serviceSchema);