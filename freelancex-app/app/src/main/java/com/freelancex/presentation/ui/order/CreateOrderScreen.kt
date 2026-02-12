package com.freelancex.presentation.ui.order

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.freelancex.data.DummyData
import com.freelancex.presentation.viewmodel.OrderViewModel

/**
 * Create Order Screen - Allows users to place orders for services
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateOrderScreen(
    serviceId: String,
    freelancerId: String,
    onNavigateBack: () -> Unit,
    onOrderCreated: () -> Unit,
    viewModel: OrderViewModel = hiltViewModel()
) {
    val context = LocalContext.current
    val orderState by viewModel.orderState.collectAsState()
    
    // Load service and freelancer data
    val serviceViewModel: com.freelancex.presentation.viewmodel.ServiceViewModel = hiltViewModel()
    val freelancerViewModel: com.freelancex.presentation.viewmodel.FreelancerViewModel = hiltViewModel()
    
    val serviceState by serviceViewModel.serviceState.collectAsState()
    val freelancerState by freelancerViewModel.freelancerState.collectAsState()
    
    LaunchedEffect(serviceId, freelancerId) {
        serviceViewModel.loadService(serviceId)
        freelancerViewModel.loadFreelancer(freelancerId)
    }
    
    val service = serviceState.service
    val freelancer = freelancerState.freelancer
    
    var requirements by remember { mutableStateOf("") }
    var selectedDelivery by remember { mutableStateOf("5 days") }
    var expanded by remember { mutableStateOf(false) }
    
    val deliveryOptions = listOf("2 days", "5 days", "7 days", "14 days", "30 days")
    
    // Handle order creation success
    LaunchedEffect(orderState.isSuccess) {
        if (orderState.isSuccess) {
            Toast.makeText(context, "Order placed successfully!", Toast.LENGTH_SHORT).show()
            onOrderCreated()
        }
    }
    
    // Handle order creation error
    LaunchedEffect(orderState.error) {
        orderState.error?.let { error ->
            Toast.makeText(context, "Error: $error", Toast.LENGTH_LONG).show()
        }
    }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Create Order") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Service Information Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                )
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "Service",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f)
                    )
                    Text(
                        text = service?.title ?: "Unknown Service",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    Text(
                        text = "Freelancer",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f)
                    )
                    Text(
                        text = freelancer?.name ?: "Unknown Freelancer",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    Text(
                        text = "Price: ${com.freelancex.utils.UiUtils.formatPrice(service?.price?.toInt() ?: 0)}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }
            
            // Project Requirements
            OutlinedTextField(
                value = requirements,
                onValueChange = { requirements = it },
                label = { Text("Project Requirements *") },
                placeholder = { Text("Describe your project requirements in detail...") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp),
                maxLines = 10,
                supportingText = {
                    Text("${requirements.length}/1000 characters")
                },
                isError = requirements.isBlank()
            )
            
            // Delivery Preference Dropdown
            ExposedDropdownMenuBox(
                expanded = expanded,
                onExpandedChange = { expanded = !expanded }
            ) {
                OutlinedTextField(
                    value = selectedDelivery,
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Delivery Preference") },
                    trailingIcon = {
                        ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .menuAnchor(),
                    colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors()
                )
                
                ExposedDropdownMenu(
                    expanded = expanded,
                    onDismissRequest = { expanded = false }
                ) {
                    deliveryOptions.forEach { option ->
                        DropdownMenuItem(
                            text = { Text(option) },
                            onClick = {
                                selectedDelivery = option
                                expanded = false
                            }
                        )
                    }
                }
            }
            
            // Order Summary
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                )
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "Order Summary",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    
                    Divider(modifier = Modifier.padding(vertical = 8.dp))
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Service Price:")
                        Text(
                            text = com.freelancex.utils.UiUtils.formatPrice(service?.price?.toInt() ?: 0),
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Delivery Time:")
                        Text(
                            text = selectedDelivery,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                    
                    Divider(modifier = Modifier.padding(vertical = 8.dp))
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Total:",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = com.freelancex.utils.UiUtils.formatPrice(service?.price?.toInt() ?: 0),
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Confirm Order Button
            Button(
                onClick = {
                    if (requirements.isBlank()) {
                        Toast.makeText(
                            context,
                            "Please enter project requirements",
                            Toast.LENGTH_SHORT
                        ).show()
                        return@Button
                    }
                    
                    // Create order
                    viewModel.createOrder(
                        serviceId = serviceId,
                        freelancerId = freelancerId,
                        requirements = requirements,
                        deliveryTime = selectedDelivery
                    )
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                enabled = !orderState.isLoading && requirements.isNotBlank()
            ) {
                if (orderState.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                } else {
                    Text(
                        text = "Confirm Order",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
            
            // Terms and Conditions
            Text(
                text = "By placing this order, you agree to our Terms of Service and Privacy Policy.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                modifier = Modifier.padding(horizontal = 8.dp)
            )
        }
    }
}
