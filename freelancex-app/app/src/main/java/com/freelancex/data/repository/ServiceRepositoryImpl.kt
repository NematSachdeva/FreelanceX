package com.freelancex.data.repository

import com.freelancex.data.api.FreelanceXApi
import com.freelancex.data.model.Service
import com.freelancex.data.model.ServicesResponse
import com.freelancex.domain.repository.ServiceRepository
import com.freelancex.utils.Resource
import javax.inject.Inject

/**
 * Implementation of ServiceRepository
 */
class ServiceRepositoryImpl @Inject constructor(
    private val api: FreelanceXApi
) : ServiceRepository {
    
    override suspend fun getServices(
        category: String?,
        page: Int,
        limit: Int
    ): Resource<ServicesResponse> {
        return try {
            android.util.Log.d("ServiceRepository", "Fetching services: category=$category, page=$page, limit=$limit")
            val response = api.getServices(category = category, page = page, limit = limit)
            
            if (response.isSuccessful && response.body() != null) {
                android.util.Log.d("ServiceRepository", "Services fetched successfully: ${response.body()}")
                Resource.Success(response.body()!!)
            } else {
                val error = response.message() ?: "Failed to fetch services"
                android.util.Log.e("ServiceRepository", "Error: $error")
                Resource.Error(error)
            }
        } catch (e: Exception) {
            val error = e.message ?: "An error occurred"
            android.util.Log.e("ServiceRepository", "Exception: $error", e)
            Resource.Error(error)
        }
    }
    
    override suspend fun getServiceById(serviceId: String): Resource<Service> {
        return try {
            android.util.Log.d("ServiceRepository", "Fetching service by ID: $serviceId")
            val response = api.getServiceById(serviceId)
            
            if (response.isSuccessful && response.body() != null) {
                android.util.Log.d("ServiceRepository", "Service fetched successfully")
                Resource.Success(response.body()!!)
            } else {
                val error = response.message() ?: "Failed to fetch service"
                android.util.Log.e("ServiceRepository", "Error: $error")
                Resource.Error(error)
            }
        } catch (e: Exception) {
            val error = e.message ?: "An error occurred"
            android.util.Log.e("ServiceRepository", "Exception: $error", e)
            Resource.Error(error)
        }
    }
    
    override suspend fun searchServices(query: String): Resource<ServicesResponse> {
        return try {
            android.util.Log.d("ServiceRepository", "Searching services: query=$query")
            val response = api.searchServices(query)
            
            if (response.isSuccessful && response.body() != null) {
                android.util.Log.d("ServiceRepository", "Search results fetched successfully")
                Resource.Success(response.body()!!)
            } else {
                val error = response.message() ?: "Failed to search services"
                android.util.Log.e("ServiceRepository", "Error: $error")
                Resource.Error(error)
            }
        } catch (e: Exception) {
            val error = e.message ?: "An error occurred"
            android.util.Log.e("ServiceRepository", "Exception: $error", e)
            Resource.Error(error)
        }
    }
}
