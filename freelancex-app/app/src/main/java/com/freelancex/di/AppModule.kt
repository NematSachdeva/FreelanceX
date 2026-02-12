package com.freelancex.di

import android.content.Context
import com.freelancex.data.repository.AuthRepositoryImpl
import com.freelancex.data.repository.OrderRepositoryImpl
import com.freelancex.data.repository.ServiceRepositoryImpl
import com.freelancex.data.repository.UserRepositoryImpl
import com.freelancex.domain.repository.AuthRepository
import com.freelancex.domain.repository.OrderRepository
import com.freelancex.domain.repository.ServiceRepository
import com.freelancex.domain.repository.UserRepository
import com.freelancex.utils.TokenManager
import dagger.Binds
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Main dependency injection module for the app
 */
@Module
@InstallIn(SingletonComponent::class)
abstract class AppModule {
    
    @Binds
    @Singleton
    abstract fun bindAuthRepository(
        authRepositoryImpl: AuthRepositoryImpl
    ): AuthRepository
    
    @Binds
    @Singleton
    abstract fun bindServiceRepository(
        serviceRepositoryImpl: ServiceRepositoryImpl
    ): ServiceRepository
    
    @Binds
    @Singleton
    abstract fun bindUserRepository(
        userRepositoryImpl: UserRepositoryImpl
    ): UserRepository
    
    @Binds
    @Singleton
    abstract fun bindOrderRepository(
        orderRepositoryImpl: OrderRepositoryImpl
    ): OrderRepository
    
    companion object {
        @Provides
        @Singleton
        fun provideTokenManager(@ApplicationContext context: Context): TokenManager {
            return TokenManager(context)
        }
        
        @Provides
        @Singleton
        fun provideThemePreferences(@ApplicationContext context: Context): com.freelancex.data.datastore.ThemePreferences {
            return com.freelancex.data.datastore.ThemePreferences(context)
        }
    }
}