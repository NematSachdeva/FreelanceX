package com.freelancex.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.freelancex.data.model.Order
import com.freelancex.domain.repository.OrderRepository
import com.freelancex.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for managing orders
 */
@HiltViewModel
class OrderViewModel @Inject constructor(
    private val orderRepository: OrderRepository
) : ViewModel() {
    
    private val _orderState = MutableStateFlow(OrderState())
    val orderState: StateFlow<OrderState> = _orderState.asStateFlow()
    
    init {
        loadOrders()
    }
    
    /**
     * Load user's orders
     */
    fun loadOrders() {
        viewModelScope.launch {
            _orderState.value = _orderState.value.copy(isLoading = true, error = null)
            
            when (val result = orderRepository.getUserOrders()) {
                is Resource.Success -> {
                    _orderState.value = _orderState.value.copy(
                        orders = result.data?.orders ?: emptyList(),
                        isLoading = false
                    )
                }
                is Resource.Error -> {
                    _orderState.value = _orderState.value.copy(
                        error = result.message ?: "Failed to load orders",
                        isLoading = false
                    )
                }
                is Resource.Loading -> {
                    _orderState.value = _orderState.value.copy(isLoading = true)
                }
            }
        }
    }
    
    /**
     * Create a new order
     */
    fun createOrder(
        serviceId: String,
        freelancerId: String,
        requirements: String,
        deliveryTime: String
    ) {
        viewModelScope.launch {
            _orderState.value = _orderState.value.copy(
                isLoading = true,
                error = null,
                isSuccess = false
            )
            
            when (val result = orderRepository.createOrder(
                serviceId = serviceId,
                freelancerId = freelancerId,
                requirements = requirements,
                deliveryTime = deliveryTime
            )) {
                is Resource.Success -> {
                    _orderState.value = _orderState.value.copy(
                        isLoading = false,
                        isSuccess = true
                    )
                    // Reload orders to show the new one
                    loadOrders()
                }
                is Resource.Error -> {
                    _orderState.value = _orderState.value.copy(
                        error = result.message ?: "Failed to create order",
                        isLoading = false,
                        isSuccess = false
                    )
                }
                is Resource.Loading -> {
                    _orderState.value = _orderState.value.copy(isLoading = true)
                }
            }
        }
    }
}

/**
 * State for order screen
 */
data class OrderState(
    val orders: List<Order> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val isSuccess: Boolean = false
)
