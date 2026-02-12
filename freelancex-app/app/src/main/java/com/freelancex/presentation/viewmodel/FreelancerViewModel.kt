package com.freelancex.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.freelancex.data.model.User
import com.freelancex.domain.repository.UserRepository
import com.freelancex.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Freelancer Profile screen
 */
@HiltViewModel
class FreelancerViewModel @Inject constructor(
    private val userRepository: UserRepository
) : ViewModel() {
    
    private val _freelancerState = MutableStateFlow(FreelancerState())
    val freelancerState: StateFlow<FreelancerState> = _freelancerState.asStateFlow()
    
    /**
     * Load freelancer by ID
     */
    fun loadFreelancer(freelancerId: String) {
        viewModelScope.launch {
            _freelancerState.value = _freelancerState.value.copy(isLoading = true, error = null)
            
            android.util.Log.d("FreelancerViewModel", "Loading freelancer: $freelancerId")
            
            when (val result = userRepository.getUserById(freelancerId)) {
                is Resource.Success -> {
                    android.util.Log.d("FreelancerViewModel", "Freelancer loaded: ${result.data?.name}")
                    _freelancerState.value = _freelancerState.value.copy(
                        freelancer = result.data,
                        isLoading = false
                    )
                }
                is Resource.Error -> {
                    android.util.Log.e("FreelancerViewModel", "Error loading freelancer: ${result.message}")
                    _freelancerState.value = _freelancerState.value.copy(
                        error = result.message,
                        isLoading = false
                    )
                }
                is Resource.Loading -> {
                    _freelancerState.value = _freelancerState.value.copy(isLoading = true)
                }
            }
        }
    }
    
    /**
     * Retry loading
     */
    fun retry(freelancerId: String) {
        loadFreelancer(freelancerId)
    }
}

/**
 * State for freelancer profile screen
 */
data class FreelancerState(
    val freelancer: User? = null,
    val isLoading: Boolean = false,
    val error: String? = null
)
