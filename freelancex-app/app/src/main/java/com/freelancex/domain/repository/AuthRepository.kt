package com.freelancex.domain.repository

import com.freelancex.data.model.AuthResponse
import com.freelancex.data.model.LoginRequest
import com.freelancex.data.model.RegisterRequest
import com.freelancex.data.model.User
import com.freelancex.utils.Resource

/**
 * Authentication repository interface
 * 
 * Defines the contract for authentication-related operations
 */
interface AuthRepository {
    
    suspend fun login(request: LoginRequest): Resource<AuthResponse>
    
    suspend fun register(request: RegisterRequest): Resource<AuthResponse>
    
    suspend fun getCurrentUser(): Resource<User>
    
    suspend fun updateProfile(request: com.freelancex.data.model.UpdateProfileRequest): Resource<User>
    
    suspend fun deleteAccount(): Resource<Unit>
    
    suspend fun logout(): Resource<Unit>
    
    fun isLoggedIn(): Boolean
    
    fun getUserRole(): String?
}