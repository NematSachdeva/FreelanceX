package com.freelancex.data

import com.freelancex.data.model.Order
import com.freelancex.data.model.OrderStatus
import com.freelancex.data.model.Service
import com.freelancex.data.model.User

/**
 * Dummy data for the FreelanceX app
 */
object DummyData {
    
    // Dummy Freelancers
    val dummyFreelancers = listOf(
        User(
            id = "freelancer1",
            name = "Alex Sharma",
            email = "alex@freelancex.com",
            role = "freelancer",
            rating = 4.9,
            completedOrders = 127,
            skills = listOf("React", "Node.js", "MongoDB", "JavaScript"),
            hourlyRate = 1200.0,
            location = "Mumbai, India",
            bio = "Full-stack developer with 5+ years experience"
        ),
        User(
            id = "freelancer2",
            name = "Priya Patel",
            email = "priya@freelancex.com",
            role = "freelancer",
            rating = 4.8,
            completedOrders = 89,
            skills = listOf("UI/UX Design", "Figma", "Adobe XD", "Prototyping"),
            hourlyRate = 800.0,
            location = "Bangalore, India",
            bio = "Creative UI/UX designer specializing in mobile apps"
        ),
        User(
            id = "freelancer3",
            name = "Raj Kumar",
            email = "raj@freelancex.com",
            role = "freelancer",
            rating = 4.7,
            completedOrders = 65,
            skills = listOf("Android", "Kotlin", "Flutter", "iOS"),
            hourlyRate = 1500.0,
            location = "Delhi, India",
            bio = "Mobile app developer with expertise in native and cross-platform"
        ),
        User(
            id = "freelancer4",
            name = "Sarah Singh",
            email = "sarah@freelancex.com",
            role = "freelancer",
            rating = 4.6,
            completedOrders = 112,
            skills = listOf("Digital Marketing", "SEO", "Social Media", "Analytics"),
            hourlyRate = 900.0,
            location = "Pune, India",
            bio = "Digital marketing expert with proven ROI results"
        ),
        User(
            id = "freelancer5",
            name = "Amit Verma",
            email = "amit@freelancex.com",
            role = "freelancer",
            rating = 4.9,
            completedOrders = 203,
            skills = listOf("Graphic Design", "Illustrator", "Photoshop", "Branding"),
            hourlyRate = 700.0,
            location = "Jaipur, India",
            bio = "Creative graphic designer with award-winning designs"
        )
    )
    
    // Dummy Services
    val dummyServices = listOf(
        Service(
            id = "service1",
            title = "Modern E-commerce Website",
            description = "Complete responsive e-commerce solution with payment integration, admin panel, and inventory management",
            category = "web-development",
            price = 15000.0,
            rating = 4.9,
            reviewCount = 45,
            image = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
            createdBy = dummyFreelancers[0],
            deliveryTime = "7 days",
            tags = listOf("React", "Node.js", "MongoDB", "Payment Gateway"),
            orderCount = 127
        ),
        Service(
            id = "service2",
            title = "Mobile App UI/UX Design",
            description = "Beautiful and intuitive mobile app design with prototypes, user flows, and design system",
            category = "ui-ux-design",
            price = 8500.0,
            rating = 4.8,
            reviewCount = 38,
            image = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
            createdBy = dummyFreelancers[1],
            deliveryTime = "5 days",
            tags = listOf("Figma", "Adobe XD", "Prototyping", "User Research"),
            orderCount = 89
        ),
        Service(
            id = "service3",
            title = "Android App Development",
            description = "Native Android app with modern features, clean architecture, and Material Design",
            category = "mobile-development",
            price = 25000.0,
            rating = 4.7,
            reviewCount = 32,
            image = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
            createdBy = dummyFreelancers[2],
            deliveryTime = "14 days",
            tags = listOf("Kotlin", "Jetpack Compose", "MVVM", "Firebase"),
            orderCount = 65
        ),
        Service(
            id = "service4",
            title = "Digital Marketing Strategy",
            description = "Complete digital marketing plan with SEO, social media strategy, and analytics setup",
            category = "digital-marketing",
            price = 12000.0,
            rating = 4.6,
            reviewCount = 56,
            image = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
            createdBy = dummyFreelancers[3],
            deliveryTime = "10 days",
            tags = listOf("SEO", "Social Media", "Analytics", "Content Strategy"),
            orderCount = 112
        ),
        Service(
            id = "service5",
            title = "Logo & Brand Identity",
            description = "Professional logo design with complete brand guidelines, color palette, and typography",
            category = "graphic-design",
            price = 5500.0,
            rating = 4.9,
            reviewCount = 78,
            image = "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400",
            createdBy = dummyFreelancers[4],
            deliveryTime = "3 days",
            tags = listOf("Illustrator", "Photoshop", "Branding", "Logo Design"),
            orderCount = 203
        ),
        Service(
            id = "service6",
            title = "Content Writing & Copywriting",
            description = "Engaging content for websites, blogs, and marketing materials with SEO optimization",
            category = "content-writing",
            price = 3500.0,
            rating = 4.8,
            reviewCount = 92,
            image = "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400",
            createdBy = dummyFreelancers[0],
            deliveryTime = "5 days",
            tags = listOf("SEO Writing", "Copywriting", "Blog Posts", "Content Strategy"),
            orderCount = 156
        ),
        Service(
            id = "service7",
            title = "WordPress Website Development",
            description = "Custom WordPress website with theme customization, plugins, and responsive design",
            category = "web-development",
            price = 9500.0,
            rating = 4.7,
            reviewCount = 41,
            image = "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400",
            createdBy = dummyFreelancers[0],
            deliveryTime = "6 days",
            tags = listOf("WordPress", "PHP", "MySQL", "Responsive Design"),
            orderCount = 98
        ),
        Service(
            id = "service8",
            title = "iOS App Development",
            description = "Native iOS application with SwiftUI, modern architecture, and App Store deployment",
            category = "mobile-development",
            price = 28000.0,
            rating = 4.8,
            reviewCount = 29,
            image = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
            createdBy = dummyFreelancers[2],
            deliveryTime = "15 days",
            tags = listOf("Swift", "SwiftUI", "iOS", "App Store"),
            orderCount = 54
        )
    )
    
    // Dummy Orders
    val dummyOrders = listOf(
        Order(
            id = "order1",
            serviceId = "service1",
            serviceTitle = "Modern E-commerce Website",
            buyerId = "current_user",
            buyerName = "You",
            sellerId = "freelancer1",
            sellerName = "Alex Sharma",
            totalAmount = 15000.0,
            status = OrderStatus.IN_PROGRESS,
            message = "Looking forward to working with you!",
            createdAt = System.currentTimeMillis() - 86400000 * 2, // 2 days ago
            updatedAt = System.currentTimeMillis() - 86400000
        ),
        Order(
            id = "order2",
            serviceId = "service2",
            serviceTitle = "Mobile App UI/UX Design",
            buyerId = "current_user",
            buyerName = "You",
            sellerId = "freelancer2",
            sellerName = "Priya Patel",
            totalAmount = 8500.0,
            status = OrderStatus.COMPLETED,
            message = "Great work! Exactly what I needed.",
            createdAt = System.currentTimeMillis() - 86400000 * 7, // 1 week ago
            updatedAt = System.currentTimeMillis() - 86400000 * 3
        ),
        Order(
            id = "order3",
            serviceId = "service5",
            serviceTitle = "Logo & Brand Identity",
            buyerId = "current_user",
            buyerName = "You",
            sellerId = "freelancer5",
            sellerName = "Amit Verma",
            totalAmount = 5500.0,
            status = OrderStatus.PENDING,
            message = "Please start working on the logo design.",
            createdAt = System.currentTimeMillis() - 86400000, // 1 day ago
            updatedAt = System.currentTimeMillis() - 86400000
        ),
        Order(
            id = "order4",
            serviceId = "service6",
            serviceTitle = "Content Writing & Copywriting",
            buyerId = "current_user",
            buyerName = "You",
            sellerId = "freelancer1",
            sellerName = "Alex Sharma",
            totalAmount = 3500.0,
            status = OrderStatus.COMPLETED,
            message = "Excellent content quality!",
            createdAt = System.currentTimeMillis() - 86400000 * 14, // 2 weeks ago
            updatedAt = System.currentTimeMillis() - 86400000 * 10
        ),
        Order(
            id = "order5",
            serviceId = "service4",
            serviceTitle = "Digital Marketing Strategy",
            buyerId = "current_user",
            buyerName = "You",
            sellerId = "freelancer4",
            sellerName = "Sarah Singh",
            totalAmount = 12000.0,
            status = OrderStatus.IN_PROGRESS,
            message = "Excited to boost our online presence!",
            createdAt = System.currentTimeMillis() - 86400000 * 5, // 5 days ago
            updatedAt = System.currentTimeMillis() - 86400000 * 2
        )
    )
    
    // Service Categories
    val categories = listOf(
        "Web Development",
        "Mobile Development", 
        "UI/UX Design",
        "Graphic Design",
        "Digital Marketing",
        "Content Writing",
        "Data Analysis",
        "Video Editing"
    )
}
