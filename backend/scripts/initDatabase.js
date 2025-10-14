const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Service = require('../models/Service');
const Order = require('../models/Order');

// Load environment variables
dotenv.config();

const initDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data (optional - remove in production)
    await User.deleteMany({});
    await Service.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create sample users
    const sampleUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'freelancer',
        profile: {
          bio: 'Full-stack developer with 5+ years experience',
          skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
          hourlyRate: 50,
          location: 'New York, USA',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
        }
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: 'password123',
        role: 'freelancer',
        profile: {
          bio: 'UI/UX Designer specializing in modern web design',
          skills: ['Figma', 'Adobe XD', 'Photoshop', 'UI Design'],
          hourlyRate: 40,
          location: 'London, UK',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
        }
      },
      {
        name: 'Mike Chen',
        email: 'mike@example.com',
        password: 'password123',
        role: 'freelancer',
        profile: {
          bio: 'Digital marketing expert with proven results',
          skills: ['SEO', 'Google Ads', 'Social Media', 'Analytics'],
          hourlyRate: 35,
          location: 'San Francisco, USA',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        }
      },
      {
        name: 'Emily Johnson',
        email: 'emily@example.com',
        password: 'password123',
        role: 'client',
        profile: {
          bio: 'Startup founder looking for talented freelancers',
          location: 'Austin, USA'
        }
      }
    ];

    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`👥 Created ${createdUsers.length} sample users`);

    // Create sample services
    const sampleServices = [
      {
        title: 'Modern React Website Development',
        description: 'I will create a modern, responsive website using React.js with clean code and best practices. Includes mobile optimization, SEO-friendly structure, and fast loading times.',
        category: 'web-development',
        price: 500,
        deliveryTime: 7,
        contactInfo: 'john@example.com',
        createdBy: createdUsers[0]._id,
        tags: ['React', 'JavaScript', 'Responsive', 'SEO'],
        images: ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400']
      },
      {
        title: 'Professional UI/UX Design',
        description: 'Complete UI/UX design service for web and mobile applications. Includes wireframes, prototypes, and final designs with developer handoff.',
        category: 'ui-ux-design',
        price: 300,
        deliveryTime: 5,
        contactInfo: 'sarah@example.com',
        createdBy: createdUsers[1]._id,
        tags: ['UI Design', 'UX Design', 'Figma', 'Prototyping'],
        images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400']
      },
      {
        title: 'SEO Optimization & Digital Marketing',
        description: 'Comprehensive SEO audit and optimization service. Includes keyword research, on-page optimization, and monthly reporting.',
        category: 'seo',
        price: 200,
        deliveryTime: 10,
        contactInfo: 'mike@example.com',
        createdBy: createdUsers[2]._id,
        tags: ['SEO', 'Digital Marketing', 'Google Analytics', 'Keywords'],
        images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400']
      },
      {
        title: 'E-commerce Website with Payment Integration',
        description: 'Full-featured e-commerce website with shopping cart, payment gateway integration, admin panel, and inventory management.',
        category: 'web-development',
        price: 1200,
        deliveryTime: 14,
        contactInfo: 'john@example.com',
        createdBy: createdUsers[0]._id,
        tags: ['E-commerce', 'Payment Gateway', 'Admin Panel', 'Inventory'],
        images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400']
      },
      {
        title: 'Mobile App UI Design',
        description: 'Modern mobile app UI design for iOS and Android. Includes all screens, components, and design system documentation.',
        category: 'ui-ux-design',
        price: 400,
        deliveryTime: 8,
        contactInfo: 'sarah@example.com',
        createdBy: createdUsers[1]._id,
        tags: ['Mobile Design', 'iOS', 'Android', 'Design System'],
        images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400']
      },
      {
        title: 'Social Media Marketing Campaign',
        description: 'Complete social media marketing campaign setup and management for 3 months. Includes content creation and analytics.',
        category: 'digital-marketing',
        price: 600,
        deliveryTime: 30,
        contactInfo: 'mike@example.com',
        createdBy: createdUsers[2]._id,
        tags: ['Social Media', 'Content Creation', 'Analytics', 'Campaign'],
        images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400']
      }
    ];

    const createdServices = await Service.insertMany(sampleServices);
    console.log(`🛍️  Created ${createdServices.length} sample services`);

    // Create sample orders
    const sampleOrders = [
      {
        service: createdServices[0]._id, // React Website Development
        buyer: createdUsers[3]._id, // Emily (client)
        seller: createdUsers[0]._id, // John (freelancer)
        status: 'in-progress',
        totalAmount: 500,
        requirements: 'I need a modern e-commerce website for my startup. Should include product catalog, shopping cart, and payment integration.',
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        paymentStatus: 'paid',
        paymentMethod: 'credit-card',
        messages: [
          {
            sender: createdUsers[3]._id,
            message: 'Hi John, excited to work with you on this project!',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            sender: createdUsers[0]._id,
            message: 'Thanks Emily! I\'ll start working on the wireframes today.',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          }
        ]
      },
      {
        service: createdServices[1]._id, // UI/UX Design
        buyer: createdUsers[3]._id, // Emily (client)
        seller: createdUsers[1]._id, // Sarah (designer)
        status: 'completed',
        totalAmount: 300,
        requirements: 'Need a complete UI/UX design for a mobile app. Target audience is young professionals.',
        deliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        paymentStatus: 'paid',
        paymentMethod: 'paypal',
        rating: {
          score: 5,
          review: 'Excellent work! Sarah delivered exactly what I needed and was very professional.',
          reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      },
      {
        service: createdServices[2]._id, // SEO Optimization
        buyer: createdUsers[3]._id, // Emily (client)
        seller: createdUsers[2]._id, // Mike (marketer)
        status: 'pending',
        totalAmount: 200,
        requirements: 'My website needs SEO optimization to rank better on Google. Focus on local search results.',
        deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        paymentStatus: 'pending',
        paymentMethod: 'credit-card'
      }
    ];

    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`📋 Created ${createdOrders.length} sample orders`);

    // Create indexes for better performance
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await Service.collection.createIndex({ title: 'text', description: 'text', tags: 'text' });
    await Service.collection.createIndex({ category: 1 });
    await Service.collection.createIndex({ createdBy: 1 });
    await Service.collection.createIndex({ price: 1 });
    await Order.collection.createIndex({ buyer: 1 });
    await Order.collection.createIndex({ seller: 1 });
    await Order.collection.createIndex({ service: 1 });
    await Order.collection.createIndex({ status: 1 });
    await Order.collection.createIndex({ createdAt: -1 });
    console.log('📊 Created database indexes');

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • Users: ${createdUsers.length}`);
    console.log(`   • Services: ${createdServices.length}`);
    console.log(`   • Orders: ${createdOrders.length}`);
    console.log(`   • Categories: ${[...new Set(sampleServices.map(s => s.category))].length}`);
    
    console.log('\n🔐 Sample Login Credentials:');
    console.log('   Freelancer: john@example.com / password123');
    console.log('   Designer: sarah@example.com / password123');
    console.log('   Marketer: mike@example.com / password123');
    console.log('   Client: emily@example.com / password123');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the initialization
initDatabase();