package com.freelancex.data.model

import android.os.Parcelable
import com.google.gson.annotations.SerializedName
import kotlinx.parcelize.Parcelize

/**
 * Service data model matching the backend MongoDB schema
 */
@Parcelize
data class Service(
    @SerializedName("_id")
    val id: String = "",
    
    @SerializedName("title")
    val title: String = "",
    
    @SerializedName("description")
    val description: String = "",
    
    @SerializedName("category")
    val category: String = "",
    
    @SerializedName("price")
    val price: Double = 0.0,
    
    @SerializedName("deliveryTime")
    val deliveryTime: String = "",
    
    @SerializedName("image")
    val image: String? = null,
    
    @SerializedName("images")
    val images: List<String> = emptyList(),
    
    @SerializedName("tags")
    val tags: List<String> = emptyList(),
    
    @SerializedName("rating")
    val rating: Double = 0.0,
    
    @SerializedName("reviewCount")
    val reviewCount: Int = 0,
    
    @SerializedName("orderCount")
    val orderCount: Int = 0,
    
    @SerializedName("createdBy")
    val createdBy: User? = null,
    
    @SerializedName("freelancerId")
    val freelancerId: String? = null, // Alternative field name
    
    @SerializedName("isActive")
    val isActive: Boolean = true,
    
    @SerializedName("featured")
    val featured: Boolean = false,
    
    @SerializedName("createdAt")
    val createdAt: String = "",
    
    @SerializedName("updatedAt")
    val updatedAt: String = ""
) : Parcelable

/**
 * Service category enum for type safety
 */
enum class ServiceCategory(val value: String, val displayName: String, val icon: String) {
    WEB_DEVELOPMENT("web-development", "Web Development", "💻"),
    MOBILE_DEVELOPMENT("mobile-development", "Mobile Development", "📱"),
    UI_UX_DESIGN("ui-ux-design", "UI/UX Design", "🎨"),
    GRAPHIC_DESIGN("graphic-design", "Graphic Design", "🖼️"),
    DIGITAL_MARKETING("digital-marketing", "Digital Marketing", "📈"),
    SEO("seo", "SEO", "🔍"),
    CONTENT_WRITING("content-writing", "Content Writing", "✍️"),
    VIDEO_EDITING("video-editing", "Video Editing", "🎬"),
    DATA_ANALYSIS("data-analysis", "Data Analysis", "📊"),
    CONSULTING("consulting", "Consulting", "💼");
    
    companion object {
        fun fromValue(value: String): ServiceCategory? {
            return values().find { it.value == value }
        }
        
        fun getAllCategories(): List<ServiceCategory> = values().toList()
    }
}

/**
 * Extension functions for Service model
 */
fun Service.getFreelancerId(): String? = createdBy?.id ?: freelancerId

fun Service.getMainImage(): String? = image ?: images.firstOrNull()

fun Service.getCategoryEnum(): ServiceCategory? = ServiceCategory.fromValue(category)

fun Service.getFormattedPrice(): String = "$${String.format("%.2f", price)}"

fun Service.getRatingText(): String = if (reviewCount > 0) {
    "${String.format("%.1f", rating)} (${reviewCount} reviews)"
} else {
    "No reviews yet"
}