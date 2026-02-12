package com.freelancex.utils

/**
 * App-wide constants
 */
object Constants {
    
    // Network
    const val BASE_URL_EMULATOR = "http://10.0.2.2:5001/api/"
    const val BASE_URL_DEVICE = "http://192.168.1.100:5001/api/" // Replace with your IP
    const val BASE_URL_PRODUCTION = "https://freelancex-backend.vercel.app/api/"
    
    // Current backend (used for reference only - actual URL is in BuildConfig)
    const val CURRENT_BACKEND = "https://freelancex-backend.vercel.app"
    
    // Request timeouts
    const val CONNECT_TIMEOUT = 30L
    const val READ_TIMEOUT = 30L
    const val WRITE_TIMEOUT = 30L
    
    // Pagination
    const val DEFAULT_PAGE_SIZE = 20
    const val INITIAL_PAGE = 1
    
    // User roles
    const val ROLE_CLIENT = "client"
    const val ROLE_FREELANCER = "freelancer"
    
    // Order statuses
    const val ORDER_STATUS_PENDING = "pending"
    const val ORDER_STATUS_IN_PROGRESS = "in-progress"
    const val ORDER_STATUS_COMPLETED = "completed"
    const val ORDER_STATUS_CANCELLED = "cancelled"
    
    // Payment methods
    const val PAYMENT_CREDIT_CARD = "credit-card"
    const val PAYMENT_PAYPAL = "paypal"
    const val PAYMENT_BANK_TRANSFER = "bank-transfer"
    const val PAYMENT_CRYPTO = "crypto"
    
    // Service categories
    val SERVICE_CATEGORIES = listOf(
        "web-development",
        "mobile-development",
        "ui-ux-design",
        "graphic-design",
        "digital-marketing",
        "seo",
        "content-writing",
        "video-editing",
        "data-analysis",
        "consulting"
    )
    
    // Image placeholders
    const val PLACEHOLDER_AVATAR = "https://via.placeholder.com/150/2563eb/ffffff?text=User"
    const val PLACEHOLDER_SERVICE = "https://via.placeholder.com/400x300/f3f4f6/6b7280?text=Service"
    
    // Deep linking
    const val DEEP_LINK_SCHEME = "freelancex"
    const val DEEP_LINK_HOST = "app"
    
    // Validation
    const val MIN_PASSWORD_LENGTH = 6
    const val MAX_BIO_LENGTH = 500
    const val MAX_REQUIREMENTS_LENGTH = 1000
    
    // Animation durations
    const val ANIMATION_DURATION_SHORT = 200L
    const val ANIMATION_DURATION_MEDIUM = 300L
    const val ANIMATION_DURATION_LONG = 500L
}