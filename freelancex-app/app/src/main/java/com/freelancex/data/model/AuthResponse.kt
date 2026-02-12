package com.freelancex.data.model

import com.google.gson.annotations.SerializedName

/**
 * Authentication response models
 */
data class AuthResponse(
    @SerializedName("success")
    val success: Boolean = false,
    
    @SerializedName("message")
    val message: String = "",
    
    @SerializedName("token")
    val token: String? = null,
    
    @SerializedName("user")
    val user: User? = null
)

data class LoginRequest(
    @SerializedName("email")
    val email: String,
    
    @SerializedName("password")
    val password: String
)

data class RegisterRequest(
    @SerializedName("name")
    val name: String,
    
    @SerializedName("email")
    val email: String,
    
    @SerializedName("password")
    val password: String,
    
    @SerializedName("role")
    val role: String, // "client" or "freelancer"
    
    @SerializedName("accountType")
    val accountType: String? = null // Alternative field name
)

/**
 * Generic API response wrapper
 */
data class ApiResponse<T>(
    @SerializedName("success")
    val success: Boolean = false,
    
    @SerializedName("message")
    val message: String = "",
    
    @SerializedName("data")
    val data: T? = null,
    
    @SerializedName("error")
    val error: String? = null
)

/**
 * Services response
 */
data class ServicesResponse(
    @SerializedName("services")
    val services: List<Service> = emptyList(),
    
    @SerializedName("total")
    val total: Int = 0,
    
    @SerializedName("page")
    val page: Int = 1,
    
    @SerializedName("totalPages")
    val totalPages: Int = 1
)

/**
 * Users response
 */
data class UsersResponse(
    @SerializedName("freelancers")
    val freelancers: List<User> = emptyList(),
    
    @SerializedName("users")
    val users: List<User> = emptyList(), // Alternative field name
    
    @SerializedName("total")
    val total: Int = 0
)

/**
 * Orders response
 */
data class OrdersResponse(
    @SerializedName("orders")
    val orders: List<Order> = emptyList(),
    
    @SerializedName("total")
    val total: Int = 0
)

/**
 * Create order request - matches backend schema exactly
 */
data class CreateOrderRequest(
    @SerializedName("serviceId")
    val serviceId: String,
    
    @SerializedName("clientId")
    val clientId: String,
    
    @SerializedName("freelancerId")
    val freelancerId: String,
    
    @SerializedName("requirements")
    val requirements: String
)

/**
 * Update order status request
 */
data class UpdateOrderStatusRequest(
    @SerializedName("status")
    val status: String
)

/**
 * Add review request
 */
data class AddReviewRequest(
    @SerializedName("score")
    val score: Double,
    
    @SerializedName("review")
    val review: String
)

/**
 * Update profile request
 */
data class UpdateProfileRequest(
    @SerializedName("name")
    val name: String? = null,
    
    @SerializedName("bio")
    val bio: String? = null,
    
    @SerializedName("location")
    val location: String? = null,
    
    @SerializedName("skills")
    val skills: List<String>? = null,
    
    @SerializedName("hourlyRate")
    val hourlyRate: Double? = null,
    
    @SerializedName("socialLinks")
    val socialLinks: Map<String, String>? = null
)