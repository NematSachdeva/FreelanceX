package com.freelancex.presentation

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.freelancex.presentation.navigation.FreelanceXNavigation
import com.freelancex.presentation.theme.FreelanceXTheme
import com.freelancex.utils.BackendHealthChecker
import com.freelancex.utils.TokenManager
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

/**
 * Main Activity for FreelanceX app
 * 
 * This is the single activity that hosts all the Compose screens
 * using Jetpack Navigation Compose.
 */
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    
    @Inject
    lateinit var backendHealthChecker: BackendHealthChecker
    
    @Inject
    lateinit var tokenManager: TokenManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Check backend connectivity on app launch
        Log.d("MainActivity", "\n" + "=".repeat(60))
        Log.d("MainActivity", "=== FreelanceX App Starting ===")
        Log.d("MainActivity", "=".repeat(60))
        
        backendHealthChecker.checkBackendConnectivity()
        backendHealthChecker.logAuthStatus(tokenManager)
        backendHealthChecker.logVerificationSummary()
        
        // Enable edge-to-edge display
        enableEdgeToEdge()
        
        setContent {
            val themeViewModel: com.freelancex.presentation.viewmodel.ThemeViewModel = androidx.hilt.navigation.compose.hiltViewModel()
            val isDarkMode by themeViewModel.isDarkMode.collectAsState()
            
            FreelanceXTheme(darkTheme = isDarkMode) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    FreelanceXNavigation()
                }
            }
        }
    }
}