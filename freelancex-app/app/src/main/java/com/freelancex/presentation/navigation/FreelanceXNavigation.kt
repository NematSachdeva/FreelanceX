package com.freelancex.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.freelancex.presentation.ui.auth.LoginScreen
import com.freelancex.presentation.ui.auth.RegisterScreen
import com.freelancex.presentation.ui.main.MainScreen
import com.freelancex.presentation.ui.splash.SplashScreen
import com.freelancex.presentation.viewmodel.AuthViewModel

/**
 * Main navigation component for FreelanceX app
 * 
 * Handles navigation between authentication and main app screens
 */
@Composable
fun FreelanceXNavigation(
    navController: NavHostController = rememberNavController(),
    authViewModel: AuthViewModel = hiltViewModel()
) {
    val authState by authViewModel.authState.collectAsState()
    
    NavHost(
        navController = navController,
        startDestination = Screen.Splash.route
    ) {
        // Splash Screen
        composable(Screen.Splash.route) {
            SplashScreen(
                onNavigateToAuth = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Splash.route) { inclusive = true }
                    }
                },
                onNavigateToMain = {
                    navController.navigate(Screen.Main.route) {
                        popUpTo(Screen.Splash.route) { inclusive = true }
                    }
                }
            )
        }
        
        // Authentication Screens
        composable(Screen.Login.route) {
            LoginScreen(
                onNavigateToRegister = {
                    navController.navigate(Screen.Register.route)
                },
                onNavigateToMain = {
                    navController.navigate(Screen.Main.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                }
            )
        }
        
        composable(Screen.Register.route) {
            RegisterScreen(
                onNavigateToLogin = {
                    navController.popBackStack()
                },
                onNavigateToMain = {
                    navController.navigate(Screen.Main.route) {
                        popUpTo(Screen.Register.route) { inclusive = true }
                    }
                }
            )
        }
        
        // Main App (with bottom navigation)
        composable(Screen.Main.route) {
            MainScreen(
                onNavigateToAuth = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Main.route) { inclusive = true }
                    }
                },
                onNavigateToEditProfile = {
                    navController.navigate(Screen.EditProfile.route)
                },
                onNavigateToSettings = {
                    navController.navigate(Screen.Settings.route)
                },
                onNavigateToManageAccount = {
                    navController.navigate(Screen.ManageAccount.route)
                },
                onNavigateToServiceDetails = { serviceId ->
                    navController.navigate(Screen.ServiceDetails.createRoute(serviceId))
                },
                onNavigateToOrderDetails = { orderId ->
                    navController.navigate(Screen.OrderDetails.createRoute(orderId))
                },
                onNavigateToFreelancerProfile = { freelancerId ->
                    navController.navigate(Screen.FreelancerProfile.createRoute(freelancerId))
                },
                onNavigateToTopFreelancers = {
                    navController.navigate(Screen.TopFreelancers.route)
                }
            )
        }
        
        // Edit Profile Screen
        composable(Screen.EditProfile.route) {
            com.freelancex.presentation.ui.profile.EditProfileScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
        
        // Settings Screen
        composable(Screen.Settings.route) {
            com.freelancex.presentation.ui.settings.SettingsScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
        
        // Manage Account Screen
        composable(Screen.ManageAccount.route) {
            com.freelancex.presentation.ui.account.AccountManagementScreen(
                onNavigateBack = { navController.popBackStack() },
                onLogout = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(Screen.Main.route) { inclusive = true }
                    }
                }
            )
        }
        
        // Service Details Screen
        composable(Screen.ServiceDetails.route) { backStackEntry ->
            val serviceId = backStackEntry.arguments?.getString("serviceId") ?: ""
            com.freelancex.presentation.ui.service.ServiceDetailsScreen(
                serviceId = serviceId,
                onNavigateBack = { navController.popBackStack() },
                onOrderNow = { serviceId, freelancerId ->
                    navController.navigate(Screen.CreateOrder.createRoute(serviceId, freelancerId))
                }
            )
        }
        
        // Order Details Screen
        composable(Screen.OrderDetails.route) { backStackEntry ->
            val orderId = backStackEntry.arguments?.getString("orderId") ?: ""
            com.freelancex.presentation.ui.orders.OrderDetailsScreen(
                orderId = orderId,
                onNavigateBack = { navController.popBackStack() },
                onContactFreelancer = { email ->
                    // Open email app with intent
                    // This will be handled in the composable with LocalContext
                }
            )
        }
        
        // Freelancer Profile Screen
        composable(Screen.FreelancerProfile.route) { backStackEntry ->
            val freelancerId = backStackEntry.arguments?.getString("freelancerId") ?: ""
            com.freelancex.presentation.ui.freelancer.FreelancerProfileScreen(
                freelancerId = freelancerId,
                onNavigateBack = { navController.popBackStack() },
                onHireFreelancer = { freelancerId ->
                    // Find freelancer's first service and navigate to create order
                    val freelancer = com.freelancex.data.DummyData.dummyFreelancers.find { it.id == freelancerId }
                    val service = com.freelancex.data.DummyData.dummyServices.find { 
                        it.createdBy?.id == freelancerId 
                    }
                    if (service != null) {
                        navController.navigate(Screen.CreateOrder.createRoute(service.id, freelancerId))
                    }
                }
            )
        }
        
        // Top Freelancers Screen
        composable(Screen.TopFreelancers.route) {
            com.freelancex.presentation.ui.freelancer.TopFreelancersScreen(
                onNavigateBack = { navController.popBackStack() },
                onFreelancerClick = { freelancerId ->
                    navController.navigate(Screen.FreelancerProfile.createRoute(freelancerId))
                }
            )
        }
        
        // Create Order Screen
        composable(Screen.CreateOrder.route) { backStackEntry ->
            val serviceId = backStackEntry.arguments?.getString("serviceId") ?: ""
            val freelancerId = backStackEntry.arguments?.getString("freelancerId") ?: ""
            com.freelancex.presentation.ui.order.CreateOrderScreen(
                serviceId = serviceId,
                freelancerId = freelancerId,
                onNavigateBack = { navController.popBackStack() },
                onOrderCreated = {
                    // Navigate to orders screen (Main screen with Orders tab)
                    navController.navigate(Screen.Main.route) {
                        popUpTo(Screen.Main.route) { inclusive = true }
                    }
                }
            )
        }
        
        // Explore with Category Filter Screen
        composable(Screen.ExploreCategory.route) { backStackEntry ->
            val category = backStackEntry.arguments?.getString("category") ?: ""
            com.freelancex.presentation.ui.explore.ExploreScreen(
                category = category,
                onServiceClick = { serviceId ->
                    navController.navigate(Screen.ServiceDetails.createRoute(serviceId))
                }
            )
        }
    }
}

/**
 * Screen destinations for navigation
 */
sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Login : Screen("login")
    object Register : Screen("register")
    object Main : Screen("main")
    object EditProfile : Screen("edit_profile")
    object Settings : Screen("settings")
    object ManageAccount : Screen("manage_account")
    object ServiceDetails : Screen("service_details/{serviceId}") {
        fun createRoute(serviceId: String) = "service_details/$serviceId"
    }
    object OrderDetails : Screen("order_details/{orderId}") {
        fun createRoute(orderId: String) = "order_details/$orderId"
    }
    object FreelancerProfile : Screen("freelancer_profile/{freelancerId}") {
        fun createRoute(freelancerId: String) = "freelancer_profile/$freelancerId"
    }
    object TopFreelancers : Screen("top_freelancers")
    object CreateOrder : Screen("create_order/{serviceId}/{freelancerId}") {
        fun createRoute(serviceId: String, freelancerId: String) = "create_order/$serviceId/$freelancerId"
    }
    object ExploreCategory : Screen("explore_category/{category}") {
        fun createRoute(category: String) = "explore_category/$category"
    }
}