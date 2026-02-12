package com.freelancex.data.repository

import com.freelancex.data.api.FreelanceXApi
import com.freelancex.data.model.AddReviewRequest
import com.freelancex.data.model.CreateOrderRequest
import com.freelancex.data.model.Order
import com.freelancex.data.model.OrdersResponse
import com.freelancex.data.model.UpdateOrderStatusRequest
import com.freelancex.domain.repository.OrderRepository
import com.freelancex.utils.Resource
import javax.inject.Inject

/**
 * Implementation of OrderRepository
 */
class OrderRepositoryImpl @Inject constructor(
    private val api: FreelanceXApi,
    private val tokenManager: com.freelancex.utils.TokenManager
) : OrderRepository {
    
    override suspend fun getUserOrders(
        status: String?,
        page: Int,
        limit: Int
    ): Resource<OrdersResponse> {
        return try {
            val response = api.getUserOrders(status, page, limit)
            if (response.isSuccessful && response.body() != null) {
                Resource.Success(response.body()!!)
            } else {
                Resource.Error(response.message() ?: "Failed to fetch orders")
            }
        } catch (e: Exception) {
            Resource.Error(e.message ?: "An error occurred")
        }
    }
    
    override suspend fun getOrderById(orderId: String): Resource<Order> {
        return try {
            val response = api.getOrderById(orderId)
            if (response.isSuccessful && response.body() != null) {
                Resource.Success(response.body()!!)
            } else {
                Resource.Error(response.message() ?: "Failed to fetch order")
            }
        } catch (e: Exception) {
            Resource.Error(e.message ?: "An error occurred")
        }
    }
    
    override suspend fun createOrder(request: CreateOrderRequest): Resource<Order> {
        return try {
            android.util.Log.d("OrderDebug", "=== API CALL ===")
            android.util.Log.d("OrderDebug", "Sending POST request to: ${com.freelancex.BuildConfig.BASE_URL}orders")
            android.util.Log.d("OrderDebug", "Request: $request")
            android.util.Log.d("OrderDebug", "Authorization header will be added by interceptor")
            
            val response = api.createOrder(request)
            
            android.util.Log.d("OrderDebug", "=== API RESPONSE ===")
            android.util.Log.d("OrderDebug", "Response code: ${response.code()}")
            android.util.Log.d("OrderDebug", "Response message: ${response.message()}")
            android.util.Log.d("OrderDebug", "Response headers: ${response.headers()}")
            
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                android.util.Log.d("OrderRepository", "API Response: $apiResponse")
                
                if (apiResponse.data != null) {
                    android.util.Log.d("OrderRepository", "Order created successfully: ${apiResponse.data}")
                    Resource.Success(apiResponse.data)
                } else {
                    val errorMsg = apiResponse.error ?: "Failed to create order"
                    android.util.Log.e("OrderRepository", "API Error: $errorMsg")
                    Resource.Error(errorMsg)
                }
            } else {
                val errorBody = response.errorBody()?.string()
                val errorMsg = when (response.code()) {
                    400 -> "Invalid order data. Please check your input."
                    401 -> "Authentication failed. Please login again."
                    403 -> "You don't have permission to create orders."
                    404 -> "Service or freelancer not found."
                    500 -> "Server error. Please try again later."
                    else -> response.message() ?: "Failed to create order"
                }
                android.util.Log.e("OrderRepository", "HTTP Error ${response.code()}: $errorMsg")
                android.util.Log.e("OrderRepository", "Error body: $errorBody")
                Resource.Error(errorMsg)
            }
        } catch (e: Exception) {
            val errorMsg = when (e) {
                is java.net.UnknownHostException -> "No internet connection"
                is java.net.SocketTimeoutException -> "Request timeout. Please try again."
                is javax.net.ssl.SSLException -> "SSL connection error"
                else -> e.message ?: "An error occurred"
            }
            android.util.Log.e("OrderRepository", "Exception: $errorMsg", e)
            Resource.Error(errorMsg)
        }
    }
    
    override suspend fun createOrder(
        serviceId: String,
        freelancerId: String,
        requirements: String,
        deliveryTime: String
    ): Resource<Order> {
        // Get the current user's ID (clientId)
        val clientId = tokenManager.getUserId()
        val token = tokenManager.getAuthToken()
        
        // Detailed logging for debugging
        android.util.Log.d("OrderDebug", "=== ORDER CREATION DEBUG ===")
        android.util.Log.d("OrderDebug", "serviceId: $serviceId")
        android.util.Log.d("OrderDebug", "clientId: $clientId")
        android.util.Log.d("OrderDebug", "freelancerId: $freelancerId")
        android.util.Log.d("OrderDebug", "requirements: $requirements")
        android.util.Log.d("OrderDebug", "token exists: ${token != null}")
        android.util.Log.d("OrderDebug", "token (first 20 chars): ${token?.take(20)}...")
        android.util.Log.d("OrderDebug", "Authorization header: ${tokenManager.getAuthorizationHeader()}")
        
        if (clientId == null) {
            android.util.Log.e("OrderDebug", "ERROR: No user ID found. User must be logged in.")
            return Resource.Error("Please login to create an order")
        }
        
        if (clientId.isBlank()) {
            android.util.Log.e("OrderDebug", "ERROR: User ID is blank")
            return Resource.Error("Invalid user session. Please login again.")
        }
        
        if (serviceId.isBlank()) {
            android.util.Log.e("OrderDebug", "ERROR: Service ID is blank")
            return Resource.Error("Invalid service. Please try again.")
        }
        
        if (freelancerId.isBlank()) {
            android.util.Log.e("OrderDebug", "ERROR: Freelancer ID is blank")
            return Resource.Error("Invalid freelancer. Please try again.")
        }
        
        val request = CreateOrderRequest(
            serviceId = serviceId,
            clientId = clientId,
            freelancerId = freelancerId,
            requirements = requirements
        )
        
        android.util.Log.d("OrderDebug", "Request object: $request")
        android.util.Log.d("OrderDebug", "Request JSON would be:")
        android.util.Log.d("OrderDebug", "{")
        android.util.Log.d("OrderDebug", "  \"serviceId\": \"$serviceId\",")
        android.util.Log.d("OrderDebug", "  \"clientId\": \"$clientId\",")
        android.util.Log.d("OrderDebug", "  \"freelancerId\": \"$freelancerId\",")
        android.util.Log.d("OrderDebug", "  \"requirements\": \"$requirements\"")
        android.util.Log.d("OrderDebug", "}")
        android.util.Log.d("OrderDebug", "=== END DEBUG ===")
        
        return createOrder(request)
    }
    
    override suspend fun updateOrderStatus(orderId: String, status: String): Resource<Order> {
        return try {
            val response = api.updateOrderStatus(orderId, UpdateOrderStatusRequest(status))
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    Resource.Success(apiResponse.data)
                } else {
                    Resource.Error(apiResponse.error ?: "Failed to update order")
                }
            } else {
                Resource.Error(response.message() ?: "Failed to update order")
            }
        } catch (e: Exception) {
            Resource.Error(e.message ?: "An error occurred")
        }
    }
    
    override suspend fun addOrderRating(orderId: String, request: AddReviewRequest): Resource<Order> {
        return try {
            val response = api.addOrderRating(orderId, request)
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    Resource.Success(apiResponse.data)
                } else {
                    Resource.Error(apiResponse.error ?: "Failed to add rating")
                }
            } else {
                Resource.Error(response.message() ?: "Failed to add rating")
            }
        } catch (e: Exception) {
            Resource.Error(e.message ?: "An error occurred")
        }
    }
}
