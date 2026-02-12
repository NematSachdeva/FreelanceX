package com.freelancex.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.freelancex.data.model.Service
import com.freelancex.domain.repository.ServiceRepository
import com.freelancex.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Service Details screen
 */
@HiltViewModel
class ServiceViewModel @Inject constructor(
    private val serviceRepository: ServiceRepository
) : ViewModel() {
    
    private val _serviceState = MutableStateFlow(ServiceState())
    val serviceState: StateFlow<ServiceState> = _serviceState.asStateFlow()
    
    /**
     * Load service by ID
     */
    fun loadService(serviceId: String) {
        viewModelScope.launch {
            _serviceState.value = _serviceState.value.copy(isLoading = true, error = null)
            
            android.util.Log.d("ServiceViewModel", "Loading service: $serviceId")
            
            when (val result = serviceRepository.getServiceById(serviceId)) {
                is Resource.Success -> {
                    android.util.Log.d("ServiceViewModel", "Service loaded: ${result.data?.title}")
                    _serviceState.value = _serviceState.value.copy(
                        service = result.data,
                        isLoading = false
                    )
                }
                is Resource.Error -> {
                    android.util.Log.e("ServiceViewModel", "Error loading service: ${result.message}")
                    _serviceState.value = _serviceState.value.copy(
                        error = result.message,
                        isLoading = false
                    )
                }
                is Resource.Loading -> {
                    _serviceState.value = _serviceState.value.copy(isLoading = true)
                }
            }
        }
    }
    
    /**
     * Retry loading
     */
    fun retry(serviceId: String) {
        loadService(serviceId)
    }
}

/**
 * State for service details screen
 */
data class ServiceState(
    val service: Service? = null,
    val isLoading: Boolean = false,
    val error: String? = null
)
