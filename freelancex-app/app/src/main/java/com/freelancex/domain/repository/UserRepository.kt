package com.freelancex.domain.repository

import com.freelancex.data.model.User
import com.freelancex.data.model.UsersResponse
import com.freelancex.utils.Resource

/**
 * User repository interface
 */
interface UserRepository {
    
    suspend fun getUsers(
        role: String? = null,
        page: Int = 1,
        limit: Int = 20
    ): Resource<UsersResponse>
    
    suspend fun getUserById(userId: String): Resource<User>
    
    suspend fun getCurrentUser(): Resource<User>
}
