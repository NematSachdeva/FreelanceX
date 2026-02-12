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
 * ViewModel for Order Details screen
 */
@HiltViewModel
class OrderDetailsViewModel @Inject constructor(
    private val orderRepository: OrderRepository
) : ViewModel() {
    
    private val _orderDetailsState = MutableStateFlow(OrderDetailsState())
    val orderDetailsState: StateFlow<OrderDetailsState> = _orderDetailsState.asStateFlow()
    
    /**
     * Load order by ID
     */
    fun loadOrder(orderId: String) {
        viewModelScope.launch {
            _orderDetailsState.value = _orderDetailsState.value.copy(isLoading = true, error = null)
            
            android.util.Log.d("OrderDetailsViewModel", "Loading order: $orderId")
            
            when (val result = orderRepository.getOrderById(orderId)) {
                is Resource.Success -> {
                    android.util.Log.d("OrderDetailsViewModel", "Order loaded: ${result.data?.id}")
                    _orderDetailsState.value = _orderDetailsState.value.copy(
                        order = result.data,
                        isLoading = false
                    )
                }
                is Resource.Error -> {
                    android.util.Log.e("OrderDetailsViewModel", "Error loading order: ${result.message}")
                    _orderDetailsState.value = _orderDetailsState.value.copy(
                        error = result.message,
                        isLoading = false
                    )
                }
                is Resource.Loading -> {
                    _orderDetailsState.value = _orderDetailsState.value.copy(isLoading = true)
                }
            }
        }
    }
    
    /**
     * Retry loading
     */
    fun retry(orderId: String) {
        loadOrder(orderId)
    }
}

/**
 * State for order details screen
 */
data class OrderDetailsState(
    val order: Order? = null,
    val isLoading: Boolean = false,
    val error: String? = null
)
