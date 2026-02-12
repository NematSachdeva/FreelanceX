package com.freelancex.data.repository

import com.freelancex.data.api.FreelanceXApi
import com.freelancex.data.model.User
import com.freelancex.data.model.UsersResponse
import com.freelancex.domain.repository.UserRepository
import com.freelancex.utils.Resource
import javax.inject.Inject

/**
 * Implementation of UserRepository
 */
class UserRepositoryImpl @Inject constructor(
    private val api: FreelanceXApi
) : UserRepository {
    
    override suspend fun getUsers(
        role: String?,
        page: Int,
        limit: Int
    ): Resource<UsersResponse> {
        return try {
            android.util.Log.d("UserRepository", "Fetching users: role=$role, page=$page, limit=$limit")
            val response = api.getUsers(role, page, limit)
            
            if (response.isSuccessful && response.body() != null) {
                android.util.Log.d("UserRepository", "Users fetched successfully: ${response.body()?.users?.size} users")
                Resource.Success(response.body()!!)
            } else {
                val error = response.message() ?: "Failed to fetch users"
                android.util.Log.e("UserRepository", "Error: $error")
                Resource.Error(error)
            }
        } catch (e: Exception) {
            val error = e.message ?: "An error occurred"
            android.util.Log.e("UserRepository", "Exception: $error", e)
            Resource.Error(error)
        }
    }
    
    override suspend fun getUserById(userId: String): Resource<User> {
        return try {
            android.util.Log.d("UserRepository", "Fetching user by ID: $userId")
            val response = api.getUserById(userId)
            
            if (response.isSuccessful && response.body() != null) {
                android.util.Log.d("UserRepository", "User fetched successfully")
                Resource.Success(response.body()!!)
            } else {
                val error = response.message() ?: "Failed to fetch user"
                android.util.Log.e("UserRepository", "Error: $error")
                Resource.Error(error)
            }
        } catch (e: Exception) {
            val error = e.message ?: "An error occurred"
            android.util.Log.e("UserRepository", "Exception: $error", e)
            Resource.Error(error)
        }
    }
    
    override suspend fun getCurrentUser(): Resource<User> {
        return try {
            android.util.Log.d("UserRepository", "Fetching current user")
            val response = api.getCurrentUser()
            
            if (response.isSuccessful && response.body() != null) {
                android.util.Log.d("UserRepository", "Current user fetched successfully")
                Resource.Success(response.body()!!)
            } else {
                val error = response.message() ?: "Failed to fetch current user"
                android.util.Log.e("UserRepository", "Error: $error")
                Resource.Error(error)
            }
        } catch (e: Exception) {
            val error = e.message ?: "An error occurred"
            android.util.Log.e("UserRepository", "Exception: $error", e)
            Resource.Error(error)
        }
    }
}
