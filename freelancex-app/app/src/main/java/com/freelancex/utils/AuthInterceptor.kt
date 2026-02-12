package com.freelancex.utils

import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject

/**
 * OkHttp interceptor to automatically add authentication headers
 * 
 * This interceptor adds the JWT token to all API requests that require authentication.
 */
class AuthInterceptor @Inject constructor(
    private val tokenManager: TokenManager
) : Interceptor {
    
    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()
        
        // Get the auth token
        val authHeader = tokenManager.getAuthorizationHeader()
        
        // If we have a token, add it to the request
        val newRequest = if (authHeader != null) {
            originalRequest.newBuilder()
                .addHeader("Authorization", authHeader)
                .addHeader("Content-Type", "application/json")
                .build()
        } else {
            originalRequest.newBuilder()
                .addHeader("Content-Type", "application/json")
                .build()
        }
        
        return chain.proceed(newRequest)
    }
}