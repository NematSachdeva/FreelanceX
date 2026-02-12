package com.freelancex.utils

/**
 * A generic wrapper class for handling API responses and states
 * 
 * This sealed class provides a clean way to handle loading, success, and error states
 * throughout the app, making it easier to manage UI states and error handling.
 */
sealed class Resource<T>(
    val data: T? = null,
    val message: String? = null
) {
    class Success<T>(data: T) : Resource<T>(data)
    class Error<T>(message: String, data: T? = null) : Resource<T>(data, message)
    class Loading<T>(data: T? = null) : Resource<T>(data)
}

/**
 * Extension functions for Resource class
 */
inline fun <T> Resource<T>.onSuccess(action: (value: T) -> Unit): Resource<T> {
    if (this is Resource.Success && data != null) action(data)
    return this
}

inline fun <T> Resource<T>.onError(action: (message: String) -> Unit): Resource<T> {
    if (this is Resource.Error) action(message ?: "Unknown error")
    return this
}

inline fun <T> Resource<T>.onLoading(action: () -> Unit): Resource<T> {
    if (this is Resource.Loading) action()
    return this
}