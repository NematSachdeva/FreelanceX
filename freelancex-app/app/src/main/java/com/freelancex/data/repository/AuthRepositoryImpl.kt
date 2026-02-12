package com.freelancex.data.repository

import com.freelancex.data.api.FreelanceXApi
import com.freelancex.data.model.AuthResponse
import com.freelancex.data.model.LoginRequest
import com.freelancex.data.model.RegisterRequest
import com.freelancex.data.model.User
import com.freelancex.domain.repository.AuthRepository
import com.freelancex.utils.Resource
import com.freelancex.utils.TokenManager
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Implementation of AuthRepository
 * 
 * Handles authentication operations including login, register, and token management
 */
@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val api: FreelanceXApi,
    private val tokenManager: TokenManager
) : AuthRepository {
    
    override suspend fun login(request: LoginRequest): Resource<AuthResponse> {
        return try {
            val response = api.login(request)
            
            if (response.isSuccessful) {
                val authResponse = response.body()
                // Backend returns token and user on success (no success field)
                if (authResponse != null && authResponse.token != null && authResponse.user != null) {
                    // Save token and user info
                    val user = authResponse.user
                    val role = if (user.role.isNotEmpty()) user.role else user.accountType
                    tokenManager.saveAuthToken(
                        token = authResponse.token,
                        userId = user.id,
                        userRole = role,
                        userEmail = user.email
                    )
                    Resource.Success(authResponse)
                } else {
                    Resource.Error(authResponse?.message ?: "Login failed")
                }
            } else {
                Resource.Error("Network error: ${response.code()}")
            }
        } catch (e: Exception) {
            Resource.Error(e.message ?: "Unknown error occurred")
        }
    }
    
    override suspend fun register(request: RegisterRequest): Resource<AuthResponse> {
        return try {
            val response = api.register(request)
            
            if (response.isSuccessful) {
                val authResponse = response.body()
                // Backend returns token and user on success (no success field)
                if (authResponse != null && authResponse.token != null && authResponse.user != null) {
                    // Save token and user info
                    val user = authResponse.user
                    val role = if (user.role.isNotEmpty()) user.role else user.accountType
                    tokenManager.saveAuthToken(
                        token = authResponse.token,
                        userId = user.id,
                        userRole = role,
                        userEmail = user.email
                    )
                    Resource.Success(authResponse)
                } else {
                    Resource.Error(authResponse?.message ?: "Registration failed")
                }
            } else {
                Resource.Error("Network error: ${response.code()}")
            }
        } catch (e: Exception) {
            Resource.Error(e.message ?: "Unknown error occurred")
        }
    }
    
    override suspend fun getCurrentUser(): Resource<User> {
        return try {
            val response = api.getCurrentUser()
            
            if (response.isSuccessful) {
                val user = response.body()
                if (user != null) {
                    Resource.Success(user)
                } else {
                    Resource.Error("User data not found")
                }
            } else {
                Resource.Error("Network error: ${response.code()}")
            }
        } catch (e: Exception) {
            Resource.Error(e.message ?: "Unknown error occurred")
        }
    }
    
    override suspend fun updateProfile(request: com.freelancex.data.model.UpdateProfileRequest): Resource<com.freelancex.data.model.User> {
        return try {
            val response = api.updateProfile(request)
            
            if (response.isSuccessful) {
                val apiResponse = response.body()
                if (apiResponse?.data != null) {
                    Resource.Success(apiResponse.data)
                } else {
                    Resource.Error(apiResponse?.message ?: "Failed to update profile")
                }
            } else {
                Resource.Error("Network error: ${response.code()}")
            }
        } catch (e: Exception) {
            Resource.Error(e.message ?: "Unknown error occurred")
        }
    }
    
    override suspend fun deleteAccount(): Resource<Unit> {
        return try {
            val response = api.deleteAccount()
            
            if (response.isSuccessful) {
                // Clear local data after successful deletion
                tokenManager.clearAuthData()
                Resource.Success(Unit)
            } else {
                Resource.Error("Failed to delete account: ${response.code()}")
            }
        } catch (e: Exception) {
            Resource.Error(e.message ?: "Unknown error occurred")
        }
    }
    
    override suspend fun logout(): Resource<Unit> {
        return try {
            // Call backend logout endpoint (optional)
            try {
                api.logout()
            } catch (e: Exception) {
                // Ignore backend errors, still clear local data
            }
            
            // Clear local auth data
            tokenManager.clearAuthData()
            Resource.Success(Unit)
        } catch (e: Exception) {
            Resource.Error(e.message ?: "Logout failed")
        }
    }
    
    override fun isLoggedIn(): Boolean {
        return tokenManager.isLoggedIn()
    }
    
    override fun getUserRole(): String? {
        return tokenManager.getUserRole()
    }
}