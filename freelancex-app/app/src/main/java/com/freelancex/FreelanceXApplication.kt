package com.freelancex

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

/**
 * FreelanceX Application class
 * 
 * This is the main application class that initializes Hilt for dependency injection
 * and sets up any global configurations needed for the app.
 */
@HiltAndroidApp
class FreelanceXApplication : Application() {
    
    override fun onCreate() {
        super.onCreate()
        
        // Initialize any global configurations here
        // For example: Logging, Crash reporting, etc.
    }
}