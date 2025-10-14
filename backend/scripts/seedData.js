const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Service = require('../models/Service');
const Order = require('../models/Order');

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create sample freelancers
    const freelancers = [
      {
        name: 'Alex Johnson',
        email: 'alex@freelancex.com',
        password: 'password123',
        role: 'freelancer',
        profilePhoto: 'https://randomuser.me/api/portraits/men/1.jpg',
        bio: 'Full-stack developer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architecture.',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
        experience: '8 years',
        hourlyRate: 75,
        rating: 4.9,
        completedOrders: 127,
        location: 'San Francisco, CA'
      },
      {
        name: 'Sarah Martinez',
        email: 'sarah@freelancex.com',
        password: 'password123',
        role: 'freelancer',
        profilePhoto: 'https://randomuser.me/api/portraits/women/2.jpg',
        bio: 'Creative UI/UX designer passionate about creating beautiful and intuitive user experiences. Expert in Figma, Adobe XD, and user research.',
        skills: ['UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Prototyping', 'User Research'],
        experience: '6 years',
        hourlyRate: 60,
        rating: 4.8,
        completedOrders: 98,
        location: 'New York, NY'
      },
      {
        name: 'Michael Chen',
        email: 'michael@freelancex.com',
        password: 'password123',
        role: 'freelancer',
        profilePhoto: 'https://randomuser.me/api/portraits/men/3.jpg',
        bio: 'SEO specialist and digital marketing expert. Helped 100+ businesses increase their organic traffic and online visibility.',
        skills: ['SEO', 'Google Analytics', 'Content Marketing', 'Link Building', 'Keyword Research'],
        experience: '5 years',
        hourlyRate: 50,
        rating: 4.7,
        completedOrders: 156,
        location: 'Austin, TX'
      },
      {
        name: 'Emma Wilson',
        email: 'emma@freelancex.com',
        password: 'password123',
        role: 'freelancer',
        profilePhoto: 'https://randomuser.me/api/portraits/women/4.jpg',
        bio: 'Professional graphic designer specializing in brand identity, logo design, and marketing materials. Creative and detail-oriented.',
        skills: ['Graphic Design', 'Logo Design', 'Branding', 'Illustrator', 'Photoshop', 'InDesign'],
        experience: '7 years',
        hourlyRate: 55,
        rating: 4.9,
        completedOrders: 203,
        location: 'Los Angeles, CA'
      },
      {
        name: 'David Brown',
        email: 'david@freelancex.com',
        password: 'password123',
        role: 'freelancer',
        profilePhoto: 'https://randomuser.me/api/portraits/men/5.jpg',
        bio: 'Mobile app developer with expertise in iOS and Android development. Built 50+ apps with millions of downloads.',
        skills: ['iOS Development', 'Android', 'React Native', 'Swift', 'Kotlin', 'Flutter'],
        experience: '6 years',
        hourlyRate: 70,
        rating: 4.8,
        completedOrders: 89,
        location: 'Seattle, WA'
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa@freelancex.com',
        password: 'password123',
        role: 'freelancer',
        profilePhoto: 'https://randomuser.me/api/portraits/women/6.jpg',
        bio: 'Content writer and copywriter creating engaging content that converts. Specialized in blog posts, website copy, and email marketing.',
        skills: ['Content Writing', 'Copywriting', 'SEO Writing', 'Blog Writing', 'Email Marketing'],
        experience: '4 years',
        hourlyRate: 40,
        rating: 4.7,
        completedOrders: 178,
        location: 'Chicago, IL'
      },
      {
        name: 'James Taylor',
        email: 'james@freelancex.com',
        password: 'password123',
        role: 'freelancer',
        profilePhoto: 'https://randomuser.me/api/portraits/men/7.jpg',
        bio: 'Video editor and motion graphics artist. Creating stunning videos for brands, YouTubers, and businesses worldwide.',
        skills: ['Video Editing', 'After Effects', 'Premiere Pro', 'Motion Graphics', 'Color Grading'],
        experience: '5 years',
        hourlyRate: 65,
        rating: 4.9,
        completedOrders: 134,
        location: 'Miami, FL'
      },
      {
        name: 'Sophia Lee',
        email: 'sophia@freelancex.com',
        password: 'password123',
        role: 'freelancer',
        profilePhoto: 'https://randomuser.me/api/portraits/women/8.jpg',
        bio: 'Data analyst and business intelligence expert. Turning data into actionable insights using Python, SQL, and Tableau.',
        skills: ['Data Analysis', 'Python', 'SQL', 'Tableau', 'Power BI', 'Excel'],
        experience: '6 years',
        hourlyRate: 68,
        rating: 4.8,
        completedOrders: 92,
        location: 'Boston, MA'
      },
      {
        name: 'Robert Garcia',
        email: 'robert@freelancex.com',
        password: 'password123',
        role: 'freelancer',
        profilePhoto: 'https://randomuser.me/api/portraits/men/9.jpg',
        bio: 'Business consultant helping startups and SMBs scale their operations. Expert in strategy, operations, and growth hacking.',
        skills: ['Business Strategy', 'Operations', 'Growth Hacking', 'Market Research', 'Financial Planning'],
        experience: '10 years',
        hourlyRate: 85,
        rating: 4.9,
        completedOrders: 76,
        location: 'Denver, CO'
      },
      {
        name: 'Olivia Martinez',
        email: 'olivia@freelancex.com',
        password: 'password123',
        role: 'freelancer',
        profilePhoto: 'https://randomuser.me/api/portraits/women/10.jpg',
        bio: 'Social media manager and influencer marketing specialist. Growing brands on Instagram, TikTok, and YouTube.',
        skills: ['Social Media Marketing', 'Instagram', 'TikTok', 'Content Strategy', 'Influencer Marketing'],
        experience: '4 years',
        hourlyRate: 45,
        rating: 4.7,
        completedOrders: 145,
        location: 'Portland, OR'
      }
    ];

    // Create clients
    const clients = [
      {
        name: 'John Smith',
        email: 'john@client.com',
        password: 'password123',
        role: 'client',
        profilePhoto: 'https://randomuser.me/api/portraits/men/20.jpg',
        bio: 'Startup founder looking for talented freelancers',
        location: 'San Francisco, CA'
      },
      {
        name: 'Emily Davis',
        email: 'emily@client.com',
        password: 'password123',
        role: 'client',
        profilePhoto: 'https://randomuser.me/api/portraits/women/20.jpg',
        bio: 'Marketing manager at a tech company',
        location: 'New York, NY'
      }
    ];

    const createdFreelancers = await User.insertMany(freelancers);
    const createdClients = await User.insertMany(clients);
    console.log(`👥 Created ${createdFreelancers.length} freelancers and ${createdClients.length} clients`);

    // Create sample services
    const services = [
      {
        title: 'Full-Stack Web Application Development',
        description: 'I will build a complete web application using React, Node.js, and MongoDB. Includes responsive design, API development, database setup, and deployment. Perfect for startups and businesses.',
        category: 'web-development',
        price: 2500,
        deliveryTime: '2 weeks',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600',
        freelancerId: createdFreelancers[0]._id,
        createdBy: createdFreelancers[0]._id,
        rating: 4.9,
        tags: ['React', 'Node.js', 'MongoDB', 'Full-Stack', 'API'],
        reviews: []
      },
      {
        title: 'Modern UI/UX Design for Web & Mobile',
        description: 'Complete UI/UX design service including wireframes, prototypes, and final designs. I create beautiful, user-friendly interfaces that convert visitors into customers.',
        category: 'ui-ux-design',
        price: 1200,
        deliveryTime: '1 week',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
        freelancerId: createdFreelancers[1]._id,
        createdBy: createdFreelancers[1]._id,
        rating: 4.8,
        tags: ['UI Design', 'UX Design', 'Figma', 'Prototyping'],
        reviews: []
      },
      {
        title: 'Complete SEO Optimization Package',
        description: 'Comprehensive SEO service including keyword research, on-page optimization, technical SEO, and link building. Guaranteed to improve your search rankings.',
        category: 'seo',
        price: 800,
        deliveryTime: '2 weeks',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
        freelancerId: createdFreelancers[2]._id,
        createdBy: createdFreelancers[2]._id,
        rating: 4.7,
        tags: ['SEO', 'Google Analytics', 'Keywords', 'Link Building'],
        reviews: []
      },
      {
        title: 'Professional Logo & Brand Identity Design',
        description: 'Create a unique logo and complete brand identity including color palette, typography, and brand guidelines. Unlimited revisions until you love it.',
        category: 'graphic-design',
        price: 500,
        deliveryTime: '5 days',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600',
        freelancerId: createdFreelancers[3]._id,
        createdBy: createdFreelancers[3]._id,
        rating: 4.9,
        tags: ['Logo Design', 'Branding', 'Graphic Design', 'Identity'],
        reviews: []
      },
      {
        title: 'iOS & Android Mobile App Development',
        description: 'Build native or cross-platform mobile apps using React Native or Flutter. Includes design, development, testing, and App Store deployment.',
        category: 'mobile-development',
        price: 3500,
        deliveryTime: '3 weeks',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600',
        freelancerId: createdFreelancers[4]._id,
        createdBy: createdFreelancers[4]._id,
        rating: 4.8,
        tags: ['Mobile App', 'React Native', 'iOS', 'Android'],
        reviews: []
      },
      {
        title: 'SEO-Optimized Blog & Article Writing',
        description: 'High-quality, engaging blog posts and articles optimized for SEO. Well-researched content that ranks well and engages your audience.',
        category: 'content-writing',
        price: 150,
        deliveryTime: '3 days',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600',
        freelancerId: createdFreelancers[5]._id,
        createdBy: createdFreelancers[5]._id,
        rating: 4.7,
        tags: ['Content Writing', 'Blog Writing', 'SEO', 'Copywriting'],
        reviews: []
      },
      {
        title: 'Professional Video Editing & Motion Graphics',
        description: 'Edit your videos to perfection with color grading, transitions, effects, and motion graphics. Perfect for YouTube, social media, and marketing.',
        category: 'video-editing',
        price: 400,
        deliveryTime: '5 days',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600',
        freelancerId: createdFreelancers[6]._id,
        createdBy: createdFreelancers[6]._id,
        rating: 4.9,
        tags: ['Video Editing', 'Motion Graphics', 'After Effects', 'Premiere Pro'],
        reviews: []
      },
      {
        title: 'Data Analysis & Business Intelligence',
        description: 'Turn your data into actionable insights with advanced analytics, visualizations, and reports. Using Python, SQL, and Tableau.',
        category: 'data-analysis',
        price: 900,
        deliveryTime: '1 week',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
        freelancerId: createdFreelancers[7]._id,
        createdBy: createdFreelancers[7]._id,
        rating: 4.8,
        tags: ['Data Analysis', 'Python', 'SQL', 'Tableau', 'BI'],
        reviews: []
      },
      {
        title: 'Business Strategy & Growth Consulting',
        description: 'Strategic consulting to help your business scale. Includes market analysis, growth strategy, operations optimization, and financial planning.',
        category: 'consulting',
        price: 1500,
        deliveryTime: '2 weeks',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
        freelancerId: createdFreelancers[8]._id,
        createdBy: createdFreelancers[8]._id,
        rating: 4.9,
        tags: ['Business Strategy', 'Consulting', 'Growth', 'Operations'],
        reviews: []
      },
      {
        title: 'Social Media Management & Content Creation',
        description: 'Complete social media management including content creation, posting schedule, engagement, and growth strategies for Instagram, TikTok, and more.',
        category: 'digital-marketing',
        price: 600,
        deliveryTime: '1 month',
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600',
        freelancerId: createdFreelancers[9]._id,
        createdBy: createdFreelancers[9]._id,
        rating: 4.7,
        tags: ['Social Media', 'Instagram', 'TikTok', 'Content Creation'],
        reviews: []
      }
    ];

    const createdServices = await Service.insertMany(services);
    console.log(`🛍️  Created ${createdServices.length} services`);

    // Create sample orders
    const orders = [
      {
        serviceId: createdServices[0]._id,
        service: createdServices[0]._id,
        clientId: createdClients[0]._id,
        buyer: createdClients[0]._id,
        freelancerId: createdFreelancers[0]._id,
        seller: createdFreelancers[0]._id,
        requirements: 'Need a full-stack e-commerce platform with payment integration and admin dashboard.',
        status: 'in-progress',
        totalAmount: 2500,
        deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      },
      {
        serviceId: createdServices[1]._id,
        service: createdServices[1]._id,
        clientId: createdClients[1]._id,
        buyer: createdClients[1]._id,
        freelancerId: createdFreelancers[1]._id,
        seller: createdFreelancers[1]._id,
        requirements: 'Design a modern UI for our SaaS product with focus on user experience.',
        status: 'completed',
        totalAmount: 1200,
        deliveryDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        rating: 5,
        review: 'Excellent work! The design exceeded our expectations.'
      },
      {
        serviceId: createdServices[2]._id,
        service: createdServices[2]._id,
        clientId: createdClients[0]._id,
        buyer: createdClients[0]._id,
        freelancerId: createdFreelancers[2]._id,
        seller: createdFreelancers[2]._id,
        requirements: 'Optimize our website for search engines and improve organic traffic.',
        status: 'pending',
        totalAmount: 800,
        deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    ];

    const createdOrders = await Order.insertMany(orders);
    console.log(`📋 Created ${createdOrders.length} sample orders`);

    // Create indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await Service.collection.createIndex({ title: 'text', description: 'text', tags: 'text' });
    await Service.collection.createIndex({ category: 1 });
    await Service.collection.createIndex({ freelancerId: 1 });
    await Order.collection.createIndex({ clientId: 1 });
    await Order.collection.createIndex({ freelancerId: 1 });
    await Order.collection.createIndex({ serviceId: 1 });
    console.log('📊 Created database indexes');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • Freelancers: ${createdFreelancers.length}`);
    console.log(`   • Clients: ${createdClients.length}`);
    console.log(`   • Services: ${createdServices.length}`);
    console.log(`   • Orders: ${createdOrders.length}`);
    
    console.log('\n🔐 Sample Login Credentials:');
    console.log('   Freelancers:');
    console.log('   • alex@freelancex.com / password123');
    console.log('   • sarah@freelancex.com / password123');
    console.log('   • michael@freelancex.com / password123');
    console.log('   Clients:');
    console.log('   • john@client.com / password123');
    console.log('   • emily@client.com / password123');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seeding
seedData();