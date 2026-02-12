package com.freelancex.data.api

import com.freelancex.data.model.*
import retrofit2.Response
import retrofit2.http.*

/**
 * FreelanceX API interface defining all endpoints
 * 
 * This interface matches the existing backend API endpoints
 * and provides type-safe methods for network calls.
 */
interface FreelanceXApi {
    
    // ==================== Authentication ====================
    
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
    
    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>
    
    @GET("users/profile/me")
    suspend fun getCurrentUser(): Response<User>
    
    // ==================== Services ====================
    
    @GET("services")
    suspend fun getServices(
        @Query("category") category: String? = null,
        @Query("search") search: String? = null,
        @Query("minPrice") minPrice: Double? = null,
        @Query("maxPrice") maxPrice: Double? = null,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("sort") sort: String? = null
    ): Response<ServicesResponse>
    
    @GET("services/{id}")
    suspend fun getServiceById(@Path("id") serviceId: String): Response<Service>
    
    @GET("services/featured")
    suspend fun getFeaturedServices(
        @Query("limit") limit: Int = 6
    ): Response<ServicesResponse>
    
    @POST("services")
    suspend fun createService(@Body service: Service): Response<ApiResponse<Service>>
    
    @PUT("services/{id}")
    suspend fun updateService(
        @Path("id") serviceId: String,
        @Body service: Service
    ): Response<ApiResponse<Service>>
    
    @DELETE("services/{id}")
    suspend fun deleteService(@Path("id") serviceId: String): Response<ApiResponse<Unit>>
    
    // ==================== Users ====================
    
    @GET("users")
    suspend fun getUsers(
        @Query("role") role: String? = null,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<UsersResponse>
    
    @GET("users")
    suspend fun getFreelancers(
        @Query("limit") limit: Int = 20,
        @Query("page") page: Int = 1,
        @Query("skills") skills: String? = null,
        @Query("minRating") minRating: Double? = null
    ): Response<UsersResponse>
    
    @GET("users/{id}")
    suspend fun getUserById(@Path("id") userId: String): Response<User>
    
    @GET("users/top")
    suspend fun getTopFreelancers(
        @Query("limit") limit: Int = 6
    ): Response<UsersResponse>
    
    @PUT("users/profile")
    suspend fun updateProfile(@Body user: UpdateProfileRequest): Response<ApiResponse<User>>
    
    @DELETE("users/me")
    suspend fun deleteAccount(): Response<ApiResponse<Unit>>
    
    @POST("auth/logout")
    suspend fun logout(): Response<ApiResponse<Unit>>
    
    // ==================== Orders ====================
    
    @GET("orders")
    suspend fun getUserOrders(
        @Query("status") status: String? = null,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<OrdersResponse>
    
    @GET("orders/{id}")
    suspend fun getOrderById(@Path("id") orderId: String): Response<Order>
    
    @POST("orders")
    suspend fun createOrder(@Body request: CreateOrderRequest): Response<ApiResponse<Order>>
    
    @PUT("orders/{id}/status")
    suspend fun updateOrderStatus(
        @Path("id") orderId: String,
        @Body request: UpdateOrderStatusRequest
    ): Response<ApiResponse<Order>>
    
    @POST("orders/{id}/rating")
    suspend fun addOrderRating(
        @Path("id") orderId: String,
        @Body request: AddReviewRequest
    ): Response<ApiResponse<Order>>
    
    // ==================== Search ====================
    
    @GET("search/services")
    suspend fun searchServices(
        @Query("q") query: String,
        @Query("category") category: String? = null,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<ServicesResponse>
    
    @GET("search/freelancers")
    suspend fun searchFreelancers(
        @Query("q") query: String,
        @Query("skills") skills: String? = null,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<UsersResponse>
    
    // ==================== Categories ====================
    
    @GET("categories")
    suspend fun getCategories(): Response<List<String>>
    
    // ==================== Statistics (for dashboard) ====================
    
    @GET("stats/dashboard")
    suspend fun getDashboardStats(): Response<DashboardStats>
}

/**
 * Dashboard statistics model
 */
data class DashboardStats(
    val totalOrders: Int = 0,
    val completedOrders: Int = 0,
    val totalEarnings: Double = 0.0,
    val averageRating: Double = 0.0,
    val activeServices: Int = 0,
    val pendingOrders: Int = 0
)