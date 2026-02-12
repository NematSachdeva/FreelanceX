package com.freelancex.utils

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Secure token management using EncryptedSharedPreferences
 * 
 * This class handles JWT token storage and retrieval securely
 * using Android's EncryptedSharedPreferences for enhanced security.
 */
@Singleton
class TokenManager @Inject constructor(
    private val context: Context
) {
    companion object {
        private const val PREFS_NAME = "freelancex_secure_prefs"
        private const val KEY_AUTH_TOKEN = "auth_token"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_USER_ROLE = "user_role"
        private const val KEY_USER_EMAIL = "user_email"
    }
    
    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()
    
    private val encryptedPrefs = EncryptedSharedPreferences.create(
        context,
        PREFS_NAME,
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )
    
    /**
     * Save authentication token and user info
     */
    fun saveAuthToken(token: String, userId: String, userRole: String, userEmail: String) {
        encryptedPrefs.edit().apply {
            putString(KEY_AUTH_TOKEN, token)
            putString(KEY_USER_ID, userId)
            putString(KEY_USER_ROLE, userRole)
            putString(KEY_USER_EMAIL, userEmail)
            apply()
        }
    }
    
    /**
     * Get stored authentication token
     */
    fun getAuthToken(): String? {
        return encryptedPrefs.getString(KEY_AUTH_TOKEN, null)
    }
    
    /**
     * Get stored user ID
     */
    fun getUserId(): String? {
        return encryptedPrefs.getString(KEY_USER_ID, null)
    }
    
    /**
     * Get stored user role
     */
    fun getUserRole(): String? {
        return encryptedPrefs.getString(KEY_USER_ROLE, null)
    }
    
    /**
     * Get stored user email
     */
    fun getUserEmail(): String? {
        return encryptedPrefs.getString(KEY_USER_EMAIL, null)
    }
    
    /**
     * Check if user is logged in
     */
    fun isLoggedIn(): Boolean {
        return !getAuthToken().isNullOrEmpty()
    }
    
    /**
     * Check if user is a freelancer
     */
    fun isFreelancer(): Boolean {
        return getUserRole()?.lowercase() == "freelancer"
    }
    
    /**
     * Check if user is a client
     */
    fun isClient(): Boolean {
        return getUserRole()?.lowercase() == "client"
    }
    
    /**
     * Clear all stored authentication data
     */
    fun clearAuthData() {
        encryptedPrefs.edit().apply {
            remove(KEY_AUTH_TOKEN)
            remove(KEY_USER_ID)
            remove(KEY_USER_ROLE)
            remove(KEY_USER_EMAIL)
            apply()
        }
    }
    
    /**
     * Get formatted authorization header
     */
    fun getAuthorizationHeader(): String? {
        val token = getAuthToken()
        return if (token != null) "Bearer $token" else null
    }
}