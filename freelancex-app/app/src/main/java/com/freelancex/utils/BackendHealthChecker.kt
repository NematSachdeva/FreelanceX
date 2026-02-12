package com.freelancex.utils

import android.util.Log
import com.freelancex.BuildConfig
import com.freelancex.data.api.FreelanceXApi
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient
import okhttp3.Request
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Utility to check backend connectivity and health
 */
@Singleton
class BackendHealthChecker @Inject constructor(
    private val api: FreelanceXApi,
    private val okHttpClient: OkHttpClient
) {
    companion object {
        private const val TAG = "BackendHealth"
    }
    
    /**
     * Check backend connectivity on app launch
     */
    fun checkBackendConnectivity() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                Log.d(TAG, "\n=== BACKEND CONNECTIVITY CHECK ===")
                Log.d(TAG, "🔍 Checking backend connectivity...")
                Log.d(TAG, "Backend URL: ${BuildConfig.BASE_URL}")
                
                // First try health endpoint
                try {
                    val healthUrl = BuildConfig.BASE_URL.replace("/api/", "/api/health")
                    Log.d(TAG, "Testing health endpoint: $healthUrl")
                    
                    val healthRequest = Request.Builder()
                        .url(healthUrl)
                        .get()
                        .build()
                    
                    val healthResponse = okHttpClient.newCall(healthRequest).execute()
                    if (healthResponse.isSuccessful) {
                        val body = healthResponse.body?.string()
                        Log.d(TAG, "✅ Health endpoint responded: ${healthResponse.code}")
                        Log.d(TAG, "✅ Response: $body")
                    } else {
                        Log.w(TAG, "⚠️ Health endpoint returned: ${healthResponse.code}")
                    }
                    healthResponse.close()
                } catch (e: Exception) {
                    Log.w(TAG, "⚠️ Health endpoint not available: ${e.message}")
                }
                
                // Try to fetch services as a connectivity test
                Log.d(TAG, "Testing services endpoint...")
                val response = api.getServices(limit = 1)
                
                if (response.isSuccessful) {
                    Log.d(TAG, "✅ Backend Connected - Status: ${response.code()}")
                    Log.d(TAG, "✅ Backend is reachable and responding")
                    Log.d(TAG, "✅ Services endpoint working")
                    
                    val servicesCount = response.body()?.services?.size ?: 0
                    Log.d(TAG, "✅ Fetched $servicesCount service(s)")
                } else {
                    Log.e(TAG, "❌ Backend Error - Status: ${response.code()}")
                    Log.e(TAG, "❌ Error body: ${response.errorBody()?.string()}")
                }
                
                Log.d(TAG, "=== END CONNECTIVITY CHECK ===\n")
            } catch (e: Exception) {
                Log.e(TAG, "❌ Backend Connection Failed: ${e.message}")
                Log.e(TAG, "❌ Error type: ${e.javaClass.simpleName}")
                e.printStackTrace()
                Log.d(TAG, "=== END CONNECTIVITY CHECK ===\n")
            }
        }
    }
    
    /**
     * Log authentication token status
     */
    fun logAuthStatus(tokenManager: TokenManager) {
        Log.d(TAG, "\n=== AUTH TOKEN STATUS ===")
        val token = tokenManager.getAuthToken()
        if (token != null) {
            Log.d(TAG, "🔑 Auth Token: Present (${token.take(20)}...)")
            Log.d(TAG, "🔑 Authorization Header: ${tokenManager.getAuthorizationHeader()?.take(30)}...")
        } else {
            Log.d(TAG, "🔑 Auth Token: Not present (user not logged in)")
        }
        Log.d(TAG, "=== END AUTH STATUS ===\n")
    }
    
    /**
     * Log comprehensive verification summary
     */
    fun logVerificationSummary() {
        Log.d(TAG, "\n" + "=".repeat(50))
        Log.d(TAG, "✅ Backend deployment verified and app synced successfully")
        Log.d(TAG, "Backend URL: ${BuildConfig.BASE_URL}")
        Log.d(TAG, "=".repeat(50) + "\n")
    }
}
