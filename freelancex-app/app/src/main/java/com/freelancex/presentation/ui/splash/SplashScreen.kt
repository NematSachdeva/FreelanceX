package com.freelancex.presentation.ui.splash

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.freelancex.presentation.theme.Blue600
import com.freelancex.presentation.theme.Purple600
import com.freelancex.presentation.viewmodel.AuthViewModel
import kotlinx.coroutines.delay

/**
 * Splash screen that checks authentication status
 * and navigates to appropriate screen
 */
@Composable
fun SplashScreen(
    onNavigateToAuth: () -> Unit,
    onNavigateToMain: () -> Unit,
    authViewModel: AuthViewModel = hiltViewModel()
) {
    val authState by authViewModel.authState.collectAsState()
    
    // Auto-navigate after delay
    LaunchedEffect(authState.isLoggedIn) {
        delay(2000) // Show splash for 2 seconds
        
        if (authState.isLoggedIn) {
            onNavigateToMain()
        } else {
            onNavigateToAuth()
        }
    }
    
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(Blue600, Purple600)
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // App Logo (placeholder)
            Box(
                modifier = Modifier
                    .size(120.dp)
                    .background(
                        Color.White.copy(alpha = 0.2f),
                        shape = androidx.compose.foundation.shape.CircleShape
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "FX",
                    style = MaterialTheme.typography.headlineLarge,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
            }
            
            androidx.compose.foundation.layout.Spacer(
                modifier = Modifier.size(24.dp)
            )
            
            // App Name
            Text(
                text = "FreelanceX",
                style = MaterialTheme.typography.headlineMedium,
                color = Color.White,
                fontWeight = FontWeight.Bold
            )
            
            androidx.compose.foundation.layout.Spacer(
                modifier = Modifier.size(8.dp)
            )
            
            // Tagline
            Text(
                text = "Find. Hire. Succeed.",
                style = MaterialTheme.typography.bodyLarge,
                color = Color.White.copy(alpha = 0.8f)
            )
        }
    }
}