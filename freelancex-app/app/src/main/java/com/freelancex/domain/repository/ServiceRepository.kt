package com.freelancex.domain.repository

import com.freelancex.data.model.Service
import com.freelancex.data.model.ServicesResponse
import com.freelancex.utils.Resource

/**
 * Service repository interface
 */
interface ServiceRepository {
    
    suspend fun getServices(
        category: String? = null,
        page: Int = 1,
        limit: Int = 20
    ): Resource<ServicesResponse>
    
    suspend fun getServiceById(serviceId: String): Resource<Service>
    
    suspend fun searchServices(query: String): Resource<ServicesResponse>
}
