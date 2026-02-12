package com.freelancex.domain.repository

import com.freelancex.data.model.AddReviewRequest
import com.freelancex.data.model.CreateOrderRequest
import com.freelancex.data.model.Order
import com.freelancex.data.model.OrdersResponse
import com.freelancex.utils.Resource

/**
 * Order repository interface
 */
interface OrderRepository {
    
    suspend fun getUserOrders(
        status: String? = null,
        page: Int = 1,
        limit: Int = 20
    ): Resource<OrdersResponse>
    
    suspend fun getOrderById(orderId: String): Resource<Order>
    
    suspend fun createOrder(request: CreateOrderRequest): Resource<Order>
    
    suspend fun createOrder(
        serviceId: String,
        freelancerId: String,
        requirements: String,
        deliveryTime: String
    ): Resource<Order>
    
    suspend fun updateOrderStatus(orderId: String, status: String): Resource<Order>
    
    suspend fun addOrderRating(orderId: String, request: AddReviewRequest): Resource<Order>
}