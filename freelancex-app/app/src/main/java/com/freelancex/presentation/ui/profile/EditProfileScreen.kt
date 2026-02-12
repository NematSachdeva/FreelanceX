package com.freelancex.presentation.ui.profile

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel

/**
 * Edit Profile Screen - Full profile editing functionality
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EditProfileScreen(
    onNavigateBack: () -> Unit,
    profileViewModel: com.freelancex.presentation.viewmodel.ProfileViewModel = androidx.hilt.navigation.compose.hiltViewModel()
) {
    val profileState by profileViewModel.profileState.collectAsState()
    val context = androidx.compose.ui.platform.LocalContext.current
    
    var name by remember { mutableStateOf("") }
    var bio by remember { mutableStateOf("") }
    var location by remember { mutableStateOf("") }
    var hourlyRate by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    
    // Load current profile data
    LaunchedEffect(profileState.user) {
        profileState.user?.let { user ->
            name = user.name
            bio = user.bio ?: ""
            location = user.location ?: ""
            hourlyRate = user.hourlyRate?.toString() ?: ""
        }
    }
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Edit Profile") },
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
            Text(
                text = "Edit Your Profile",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
            
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Full Name") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                enabled = !isLoading
            )
            
            OutlinedTextField(
                value = bio,
                onValueChange = { bio = it },
                label = { Text("Bio") },
                modifier = Modifier.fillMaxWidth(),
                minLines = 3,
                shape = RoundedCornerShape(12.dp),
                enabled = !isLoading
            )
            
            OutlinedTextField(
                value = location,
                onValueChange = { location = it },
                label = { Text("Location") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                enabled = !isLoading
            )
            
            OutlinedTextField(
                value = hourlyRate,
                onValueChange = { hourlyRate = it },
                label = { Text("Hourly Rate ($)") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                enabled = !isLoading
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Button(
                onClick = {
                    isLoading = true
                    val request = com.freelancex.data.model.UpdateProfileRequest(
                        name = name.takeIf { it.isNotBlank() },
                        bio = bio.takeIf { it.isNotBlank() },
                        location = location.takeIf { it.isNotBlank() },
                        hourlyRate = hourlyRate.toDoubleOrNull()
                    )
                    
                    profileViewModel.updateProfile(
                        request = request,
                        onSuccess = {
                            isLoading = false
                            com.freelancex.utils.UiUtils.showSuccessToast(context, "Profile updated successfully")
                            onNavigateBack()
                        },
                        onError = { error ->
                            isLoading = false
                            com.freelancex.utils.UiUtils.showErrorToast(context, error)
                        }
                    )
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(12.dp),
                enabled = !isLoading && name.isNotBlank()
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = MaterialTheme.colorScheme.onPrimary,
                        strokeWidth = 2.dp
                    )
                } else {
                    Text(
                        text = "Save Changes",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}
