package com.freelancex.data.model

import android.os.Parcelable
import com.google.gson.annotations.SerializedName
import kotlinx.parcelize.Parcelize

/**
 * Order data model matching the backend MongoDB schema
 */
@Parcelize
data class Order(
    @SerializedName("_id")
    val id: String = "",
    
    @SerializedName("serviceId")
    val serviceId: String = "",
    
    @SerializedName("serviceTitle")
    val serviceTitle: String = "",
    
    @SerializedName("buyerId")
    val buyerId: String = "",
    
    @SerializedName("buyerName")
    val buyerName: String = "",
    
    @SerializedName("sellerId")
    val sellerId: String = "",
    
    @SerializedName("sellerName")
    val sellerName: String = "",
    
    @SerializedName("freelancer")
    val freelancer: User? = null,
    
    @SerializedName("totalAmount")
    val totalAmount: Double = 0.0,
    
    @SerializedName("status")
    val status: OrderStatus = OrderStatus.PENDING,
    
    @SerializedName("message")
    val message: String? = null,
    
    @SerializedName("createdAt")
    val createdAt: Long = 0L,
    
    @SerializedName("updatedAt")
    val updatedAt: Long = 0L
) : Parcelable

/**
 * Order status enum
 */
enum class OrderStatus {
    @SerializedName("pending")
    PENDING,
    
    @SerializedName("in_progress")
    IN_PROGRESS,
    
    @SerializedName("completed")
    COMPLETED,
    
    @SerializedName("cancelled")
    CANCELLED
}
