package com.freelancex.data.model

import android.os.Parcelable
import com.google.gson.annotations.SerializedName
import kotlinx.parcelize.Parcelize

/**
 * User data model matching the backend MongoDB schema
 */
@Parcelize
data class User(
    @SerializedName("_id")
    val id: String = "",
    
    @SerializedName("name")
    val name: String = "",
    
    @SerializedName("email")
    val email: String = "",
    
    @SerializedName("role")
    val role: String = "", // "client" or "freelancer"
    
    @SerializedName("accountType")
    val accountType: String = "", // Alternative field name
    
    @SerializedName("profilePhoto")
    val profilePhoto: String? = null,
    
    @SerializedName("avatar")
    val avatar: String? = null, // Alternative field name
    
    @SerializedName("bio")
    val bio: String? = null,
    
    @SerializedName("skills")
    val skills: List<String> = emptyList(),
    
    @SerializedName("location")
    val location: String? = null,
    
    @SerializedName("hourlyRate")
    val hourlyRate: Double? = null,
    
    @SerializedName("rating")
    val rating: Double = 0.0,
    
    @SerializedName("completedOrders")
    val completedOrders: Int = 0,
    
    @SerializedName("totalEarnings")
    val totalEarnings: Double = 0.0,
    
    @SerializedName("socialLinks")
    val socialLinks: SocialLinks? = null,
    
    @SerializedName("createdAt")
    val createdAt: String = "",
    
    @SerializedName("updatedAt")
    val updatedAt: String = ""
) : Parcelable

@Parcelize
data class SocialLinks(
    @SerializedName("github")
    val github: String? = null,
    
    @SerializedName("linkedin")
    val linkedin: String? = null,
    
    @SerializedName("portfolio")
    val portfolio: String? = null,
    
    @SerializedName("website")
    val website: String? = null
) : Parcelable

/**
 * Extension functions for User model
 */
fun User.getDisplayPhoto(): String? = profilePhoto ?: avatar

fun User.getUserRole(): String = role.ifEmpty { accountType }

fun User.isFreelancer(): Boolean = getUserRole().lowercase() == "freelancer"

fun User.isClient(): Boolean = getUserRole().lowercase() == "client"