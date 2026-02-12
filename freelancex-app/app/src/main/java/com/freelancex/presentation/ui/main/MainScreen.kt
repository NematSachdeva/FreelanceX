package com.freelancex.presentation.ui.main

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.freelancex.presentation.ui.explore.ExploreScreen
import com.freelancex.presentation.ui.home.HomeScreen
import com.freelancex.presentation.ui.orders.OrdersScreen
import com.freelancex.presentation.ui.profile.ProfileScreen

/**
 * Main screen with bottom navigation
 * 
 * Contains the main app navigation with Home, Explore, Orders, and Profile tabs
 */
@Composable
fun MainScreen(
    onNavigateToAuth: () -> Unit,
    onNavigateToEditProfile: () -> Unit = {},
    onNavigateToSettings: () -> Unit = {},
    onNavigateToManageAccount: () -> Unit = {},
    onNavigateToServiceDetails: (String) -> Unit = {},
    onNavigateToOrderDetails: (String) -> Unit = {},
    onNavigateToFreelancerProfile: (String) -> Unit = {},
    onNavigateToTopFreelancers: () -> Unit = {}
) {
    val navController = rememberNavController()
    
    Scaffold(
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentDestination = navBackStackEntry?.destination
                
                bottomNavItems.forEach { item ->
                    NavigationBarItem(
                        icon = { Icon(item.icon, contentDescription = item.title) },
                        label = { Text(item.title) },
                        selected = currentDestination?.hierarchy?.any { it.route == item.route } == true,
                        onClick = {
                            navController.navigate(item.route) {
                                // Pop up to the start destination of the graph to
                                // avoid building up a large stack of destinations
                                // on the back stack as users select items
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                // Avoid multiple copies of the same destination when
                                // reselecting the same item
                                launchSingleTop = true
                                // Restore state when reselecting a previously selected item
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = BottomNavItem.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(BottomNavItem.Home.route) {
                HomeScreen(
                    onNavigateToExplore = { category ->
                        // Navigate to Explore tab with optional category filter
                        navController.navigate(BottomNavItem.Explore.route) {
                            popUpTo(navController.graph.findStartDestination().id) {
                                saveState = true
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                    onNavigateToService = onNavigateToServiceDetails,
                    onNavigateToFreelancer = onNavigateToFreelancerProfile,
                    onNavigateToTopFreelancers = onNavigateToTopFreelancers
                )
            }
            composable(BottomNavItem.Explore.route) {
                ExploreScreen(
                    onServiceClick = onNavigateToServiceDetails
                )
            }
            composable(BottomNavItem.Orders.route) {
                OrdersScreen(
                    onOrderClick = onNavigateToOrderDetails
                )
            }
            composable(BottomNavItem.Profile.route) {
                com.freelancex.presentation.ui.profile.ProfileScreenNew(
                    onNavigateToAuth = onNavigateToAuth,
                    onNavigateToEditProfile = onNavigateToEditProfile,
                    onNavigateToSettings = onNavigateToSettings,
                    onNavigateToManageAccount = onNavigateToManageAccount
                )
            }
        }
    }
}

/**
 * Bottom navigation items
 */
sealed class BottomNavItem(
    val route: String,
    val title: String,
    val icon: ImageVector
) {
    object Home : BottomNavItem("home", "Home", Icons.Default.Home)
    object Explore : BottomNavItem("explore", "Explore", Icons.Default.Search)
    object Orders : BottomNavItem("orders", "Orders", Icons.Default.ShoppingCart)
    object Profile : BottomNavItem("profile", "Profile", Icons.Default.Person)
}

private val bottomNavItems = listOf(
    BottomNavItem.Home,
    BottomNavItem.Explore,
    BottomNavItem.Orders,
    BottomNavItem.Profile
)