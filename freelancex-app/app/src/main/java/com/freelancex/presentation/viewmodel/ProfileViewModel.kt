package com.freelancex.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.freelancex.data.model.User
import com.freelancex.domain.repository.AuthRepository
import com.freelancex.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Profile Screen
 */
@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {
    
    private val _profileState = MutableStateFlow(ProfileState())
    val profileState: StateFlow<ProfileState> = _profileState.asStateFlow()
    
    /**
     * Load current user profile
     */
    fun loadProfile() {
        viewModelScope.launch {
            _profileState.value = _profileState.value.copy(isLoading = true, error = null)
            
            when (val result = authRepository.getCurrentUser()) {
                is Resource.Success -> {
                    _profileState.value = _profileState.value.copy(
                        user = result.data,
                        isLoading = false
                    )
                }
                is Resource.Error -> {
                    _profileState.value = _profileState.value.copy(
                        error = result.message ?: "Failed to load profile",
                        isLoading = false
                    )
                }
                is Resource.Loading -> {
                    _profileState.value = _profileState.value.copy(isLoading = true)
                }
            }
        }
    }
    
    /**
     * Update user profile
     */
    fun updateProfile(request: com.freelancex.data.model.UpdateProfileRequest, onSuccess: () -> Unit, onError: (String) -> Unit) {
        viewModelScope.launch {
            _profileState.value = _profileState.value.copy(isLoading = true, error = null)
            
            when (val result = authRepository.updateProfile(request)) {
                is Resource.Success -> {
                    // Reload profile after update
                    loadProfile()
                    onSuccess()
                }
                is Resource.Error -> {
                    _profileState.value = _profileState.value.copy(
                        error = result.message ?: "Failed to update profile",
                        isLoading = false
                    )
                    onError(result.message ?: "Failed to update profile")
                }
                is Resource.Loading -> {
                    _profileState.value = _profileState.value.copy(isLoading = true)
                }
            }
        }
    }
    
    /**
     * Delete user account
     */
    fun deleteAccount(onSuccess: () -> Unit, onError: (String) -> Unit) {
        viewModelScope.launch {
            when (val result = authRepository.deleteAccount()) {
                is Resource.Success -> {
                    onSuccess()
                }
                is Resource.Error -> {
                    onError(result.message ?: "Failed to delete account")
                }
                is Resource.Loading -> {}
            }
        }
    }
    
    /**
     * Logout user
     */
    fun logout(onComplete: () -> Unit) {
        viewModelScope.launch {
            authRepository.logout()
            onComplete()
        }
    }
}

/**
 * State for profile screen
 */
data class ProfileState(
    val user: User? = null,
    val isLoading: Boolean = false,
    val error: String? = null
)
