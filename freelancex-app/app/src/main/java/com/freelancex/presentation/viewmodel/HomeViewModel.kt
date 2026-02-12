package com.freelancex.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.freelancex.data.model.Service
import com.freelancex.data.model.User
import com.freelancex.domain.repository.ServiceRepository
import com.freelancex.domain.repository.UserRepository
import com.freelancex.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Home screen
 */
@HiltViewModel
class HomeViewModel @Inject constructor(
    private val serviceRepository: ServiceRepository,
    private val userRepository: UserRepository
) : ViewModel() {
    
    private val _homeState = MutableStateFlow(HomeState())
    val homeState: StateFlow<HomeState> = _homeState.asStateFlow()
    
    init {
        loadHomeData()
    }
    
    /**
     * Load all home screen data
     */
    fun loadHomeData() {
        loadFeaturedServices()
        loadTopFreelancers()
    }
    
    /**
     * Load featured services
     */
    private fun loadFeaturedServices() {
        viewModelScope.launch {
            _homeState.value = _homeState.value.copy(isLoadingServices = true, servicesError = null)
            
            when (val result = serviceRepository.getServices(limit = 10)) {
                is Resource.Success -> {
                    val services = result.data?.services ?: emptyList()
                    android.util.Log.d("HomeViewModel", "Loaded ${services.size} services")
                    _homeState.value = _homeState.value.copy(
                        featuredServices = services,
                        isLoadingServices = false
                    )
                }
                is Resource.Error -> {
                    android.util.Log.e("HomeViewModel", "Error loading services: ${result.message}")
                    _homeState.value = _homeState.value.copy(
                        servicesError = result.message,
                        isLoadingServices = false
                    )
                }
                is Resource.Loading -> {
                    _homeState.value = _homeState.value.copy(isLoadingServices = true)
                }
            }
        }
    }
    
    /**
     * Load top freelancers
     */
    private fun loadTopFreelancers() {
        viewModelScope.launch {
            _homeState.value = _homeState.value.copy(isLoadingFreelancers = true, freelancersError = null)
            
            when (val result = userRepository.getUsers(role = "freelancer", limit = 10)) {
                is Resource.Success -> {
                    val freelancers = result.data?.freelancers?.ifEmpty { result.data.users } ?: emptyList()
                    android.util.Log.d("HomeViewModel", "Loaded ${freelancers.size} freelancers")
                    _homeState.value = _homeState.value.copy(
                        topFreelancers = freelancers,
                        isLoadingFreelancers = false
                    )
                }
                is Resource.Error -> {
                    android.util.Log.e("HomeViewModel", "Error loading freelancers: ${result.message}")
                    _homeState.value = _homeState.value.copy(
                        freelancersError = result.message,
                        isLoadingFreelancers = false
                    )
                }
                is Resource.Loading -> {
                    _homeState.value = _homeState.value.copy(isLoadingFreelancers = true)
                }
            }
        }
    }
    
    /**
     * Retry loading data
     */
    fun retry() {
        loadHomeData()
    }
}

/**
 * State for home screen
 */
data class HomeState(
    val featuredServices: List<Service> = emptyList(),
    val topFreelancers: List<User> = emptyList(),
    val isLoadingServices: Boolean = false,
    val isLoadingFreelancers: Boolean = false,
    val servicesError: String? = null,
    val freelancersError: String? = null
)
