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
 * ViewModel for Explore screen
 */
@HiltViewModel
class ExploreViewModel @Inject constructor(
    private val serviceRepository: ServiceRepository
) : ViewModel() {
    
    private val _exploreState = MutableStateFlow(ExploreState())
    val exploreState: StateFlow<ExploreState> = _exploreState.asStateFlow()
    
    /**
     * Load services with optional category filter
     */
    fun loadServices(category: String? = null) {
        viewModelScope.launch {
            _exploreState.value = _exploreState.value.copy(isLoading = true, error = null)
            
            android.util.Log.d("ExploreViewModel", "Loading services with category: $category")
            
            when (val result = serviceRepository.getServices(category = category, limit = 50)) {
                is Resource.Success -> {
                    val services = result.data?.services ?: emptyList()
                    android.util.Log.d("ExploreViewModel", "Loaded ${services.size} services")
                    _exploreState.value = _exploreState.value.copy(
                        services = services,
                        isLoading = false,
                        currentCategory = category
                    )
                }
                is Resource.Error -> {
                    android.util.Log.e("ExploreViewModel", "Error loading services: ${result.message}")
                    _exploreState.value = _exploreState.value.copy(
                        error = result.message,
                        isLoading = false
                    )
                }
                is Resource.Loading -> {
                    _exploreState.value = _exploreState.value.copy(isLoading = true)
                }
            }
        }
    }
    
    /**
     * Search services
     */
    fun searchServices(query: String) {
        if (query.isBlank()) {
            loadServices(_exploreState.value.currentCategory)
            return
        }
        
        viewModelScope.launch {
            _exploreState.value = _exploreState.value.copy(isLoading = true, error = null)
            
            android.util.Log.d("ExploreViewModel", "Searching services: $query")
            
            when (val result = serviceRepository.searchServices(query)) {
                is Resource.Success -> {
                    val services = result.data?.services ?: emptyList()
                    android.util.Log.d("ExploreViewModel", "Found ${services.size} services")
                    _exploreState.value = _exploreState.value.copy(
                        services = services,
                        isLoading = false
                    )
                }
                is Resource.Error -> {
                    android.util.Log.e("ExploreViewModel", "Error searching services: ${result.message}")
                    _exploreState.value = _exploreState.value.copy(
                        error = result.message,
                        isLoading = false
                    )
                }
                is Resource.Loading -> {
                    _exploreState.value = _exploreState.value.copy(isLoading = true)
                }
            }
        }
    }
    
    /**
     * Retry loading
     */
    fun retry() {
        loadServices(_exploreState.value.currentCategory)
    }
}

/**
 * State for explore screen
 */
data class ExploreState(
    val services: List<Service> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val currentCategory: String? = null
)
