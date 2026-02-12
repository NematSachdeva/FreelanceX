package com.freelancex.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.freelancex.data.model.LoginRequest
import com.freelancex.data.model.RegisterRequest
import com.freelancex.domain.repository.AuthRepository
import com.freelancex.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for authentication operations
 */
@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {
    
    private val _authState = MutableStateFlow(AuthState())
    val authState: StateFlow<AuthState> = _authState.asStateFlow()
    
    init {
        checkAuthStatus()
    }
    
    /**
     * Check if user is already logged in
     */
    private fun checkAuthStatus() {
        _authState.value = _authState.value.copy(
            isLoggedIn = authRepository.isLoggedIn(),
            userRole = authRepository.getUserRole()
        )
    }
    
    /**
     * Login user
     */
    fun login(email: String, password: String) {
        viewModelScope.launch {
            _authState.value = _authState.value.copy(isLoading = true, error = null)
            
            val result = authRepository.login(LoginRequest(email, password))
            
            when (result) {
                is Resource.Success -> {
                    val user = result.data?.user
                    val role = if (user?.role?.isNotEmpty() == true) user.role else user?.accountType ?: ""
                    _authState.value = _authState.value.copy(
                        isLoading = false,
                        isLoggedIn = true,
                        user = user,
                        userRole = role,
                        error = null
                    )
                }
                is Resource.Error -> {
                    _authState.value = _authState.value.copy(
                        isLoading = false,
                        error = result.message
                    )
                }
                is Resource.Loading -> {
                    _authState.value = _authState.value.copy(isLoading = true)
                }
            }
        }
    }
    
    /**
     * Register user
     */
    fun register(name: String, email: String, password: String, role: String) {
        viewModelScope.launch {
            _authState.value = _authState.value.copy(isLoading = true, error = null)
            
            val result = authRepository.register(
                RegisterRequest(name, email, password, role)
            )
            
            when (result) {
                is Resource.Success -> {
                    val user = result.data?.user
                    val role = if (user?.role?.isNotEmpty() == true) user.role else user?.accountType ?: ""
                    _authState.value = _authState.value.copy(
                        isLoading = false,
                        isLoggedIn = true,
                        user = user,
                        userRole = role,
                        error = null
                    )
                }
                is Resource.Error -> {
                    _authState.value = _authState.value.copy(
                        isLoading = false,
                        error = result.message
                    )
                }
                is Resource.Loading -> {
                    _authState.value = _authState.value.copy(isLoading = true)
                }
            }
        }
    }
    
    /**
     * Logout user
     */
    fun logout() {
        viewModelScope.launch {
            authRepository.logout()
            _authState.value = AuthState() // Reset to initial state
        }
    }
    
    /**
     * Clear error message
     */
    fun clearError() {
        _authState.value = _authState.value.copy(error = null)
    }
}

/**
 * Authentication state data class
 */
data class AuthState(
    val isLoading: Boolean = false,
    val isLoggedIn: Boolean = false,
    val user: com.freelancex.data.model.User? = null,
    val userRole: String? = null,
    val error: String? = null
)