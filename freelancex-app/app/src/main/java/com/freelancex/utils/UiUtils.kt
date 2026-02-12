package com.freelancex.utils

import android.content.Context
import android.widget.Toast
import androidx.compose.material3.SnackbarDuration
import androidx.compose.material3.SnackbarHostState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

/**
 * UI utility functions for showing messages
 */
object UiUtils {
    
    /**
     * Show a toast message
     */
    fun showToast(context: Context, message: String, duration: Int = Toast.LENGTH_SHORT) {
        Toast.makeText(context, message, duration).show()
    }
    
    /**
     * Show success toast
     */
    fun showSuccessToast(context: Context, message: String) {
        showToast(context, "✓ $message", Toast.LENGTH_SHORT)
    }
    
    /**
     * Show error toast
     */
    fun showErrorToast(context: Context, message: String) {
        showToast(context, "✗ $message", Toast.LENGTH_LONG)
    }
    
    /**
     * Show snackbar
     */
    fun showSnackbar(
        scope: CoroutineScope,
        snackbarHostState: SnackbarHostState,
        message: String,
        actionLabel: String? = null,
        duration: SnackbarDuration = SnackbarDuration.Short,
        onAction: (() -> Unit)? = null
    ) {
        scope.launch {
            val result = snackbarHostState.showSnackbar(
                message = message,
                actionLabel = actionLabel,
                duration = duration
            )
            if (result == androidx.compose.material3.SnackbarResult.ActionPerformed) {
                onAction?.invoke()
            }
        }
    }
    
    /**
     * Format price in INR currency
     */
    fun formatPrice(price: Double): String {
        return "₹${String.format("%,.0f", price)}"
    }
    
    /**
     * Format price in INR currency (Int version)
     */
    fun formatPrice(price: Int): String {
        return "₹${String.format("%,d", price)}"
    }
    
    /**
     * Get display photo URL with fallback
     */
    fun getDisplayPhoto(photoUrl: String?): String {
        return photoUrl?.takeIf { it.isNotBlank() } 
            ?: "https://ui-avatars.com/api/?name=User&background=random"
    }
}
