# 🎨 Phase 1: UI Screen Update Guide

## 📋 Complete Implementation Instructions

This guide provides exact code changes needed to update all UI screens to use real backend data.

---

## 1. HomeScreen.kt Update

### Current Issue
- Uses `DummyData.dummyServices` and `DummyData.dummyFreelancers`
- No loading or error states
- Hardcoded data

### Required Changes

**Step 1: Add ViewModel Parameter**
```kotlin
@Composable
fun HomeScreen(
    viewModel: HomeViewModel = hiltViewModel(),  // ADD THIS
    onNavigateToExplore: (category: String?) -> Unit = {},
    onNavigateToService: (String) -> Unit = {},
    onNavigateToFreelancer: (String) -> Unit = {},
    onNavigateToTopFreelancers: () -> Unit = {}
) {
```

**Step 2: Collect State**
```kotlin
val homeState by viewModel.homeState.collectAsState()
```

**Step 3: Replace Featured Services Section**

**BEFORE:**
```kotlin
val services = DummyData.dummyServices.take(5)
services.forEach { service ->
    ServiceCard(service = service, onClick = { onNavigateToService(service.id) })
}
```

**AFTER:**
```kotlin
// Loading State
if (homeState.isLoadingServices) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        repeat(3) {
            Card(
                modifier = Modifier
                    .width(280.dp)
                    .height(200.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                )
            ) {
                // Shimmer effect placeholder
            }
        }
    }
}
// Error State
else if (homeState.servicesError != null) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Failed to load services",
            style = MaterialTheme.typography.titleMedium
        )
        Text(
            text = homeState.servicesError!!,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.error
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = { viewModel.retry() }) {
            Text("Retry")
        }
    }
}
// Success State
else if (homeState.featuredServices.isEmpty()) {
    Text(
        text = "No services available",
        modifier = Modifier.padding(32.dp),
        style = MaterialTheme.typography.bodyLarge
    )
} else {
    LazyRow(
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(homeState.featuredServices.take(5)) { service ->
            ServiceCard(
                service = service,
                onClick = { onNavigateToService(service.id) }
            )
        }
    }
}
```

**Step 4: Replace Top Freelancers Section**

**BEFORE:**
```kotlin
val freelancers = DummyData.dummyFreelancers.take(5)
freelancers.forEach { freelancer ->
    FreelancerCard(freelancer = freelancer, onClick = { onNavigateToFreelancer(freelancer.id) })
}
```

**AFTER:**
```kotlin
// Loading State
if (homeState.isLoadingFreelancers) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        repeat(3) {
            Card(
                modifier = Modifier
                    .width(160.dp)
                    .height(180.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                )
            ) {
                // Shimmer effect placeholder
            }
        }
    }
}
// Error State
else if (homeState.freelancersError != null) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Failed to load freelancers",
            style = MaterialTheme.typography.titleMedium
        )
        Button(onClick = { viewModel.retry() }) {
            Text("Retry")
        }
    }
}
// Success State
else if (homeState.topFreelancers.isEmpty()) {
    Text(
        text = "No freelancers available",
        modifier = Modifier.padding(32.dp),
        style = MaterialTheme.typography.bodyLarge
    )
} else {
    LazyRow(
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(homeState.topFreelancers.take(5)) { freelancer ->
            FreelancerCard(
                freelancer = freelancer,
                onClick = { onNavigateToFreelancer(freelancer.id) }
            )
        }
    }
}
```

**Step 5: Update Price Displays**

**BEFORE:**
```kotlin
Text(text = "$${service.price}")
```

**AFTER:**
```kotlin
import com.freelancex.utils.UiUtils

Text(text = UiUtils.formatPrice(service.price))
```

---

## 2. ExploreScreen.kt Update

### Required Changes

**Step 1: Add ViewModel Parameter**
```kotlin
@Composable
fun ExploreScreen(
    category: String? = null,
    viewModel: ExploreViewModel = hiltViewModel(),  // ADD THIS
    onServiceClick: (String) -> Unit = {}
) {
```

**Step 2: Collect State and Load Data**
```kotlin
val exploreState by viewModel.exploreState.collectAsState()
var searchQuery by remember { mutableStateOf("") }

LaunchedEffect(category) {
    viewModel.loadServices(category)
}
```

**Step 3: Replace Service List**

**BEFORE:**
```kotlin
val allServices = DummyData.dummyServices
val filteredServices = allServices.filter { /* ... */ }

LazyColumn {
    items(filteredServices) { service ->
        ServiceListItem(service = service, onClick = { onServiceClick(service.id) })
    }
}
```

**AFTER:**
```kotlin
// Search Bar
OutlinedTextField(
    value = searchQuery,
    onValueChange = { 
        searchQuery = it
        if (it.isNotBlank()) {
            viewModel.searchServices(it)
        } else {
            viewModel.loadServices(category)
        }
    },
    placeholder = { Text("Search services...") },
    leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search") },
    modifier = Modifier
        .fillMaxWidth()
        .padding(16.dp),
    shape = RoundedCornerShape(12.dp)
)

// Loading State
if (exploreState.isLoading) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        CircularProgressIndicator()
    }
}
// Error State
else if (exploreState.error != null) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Failed to load services",
            style = MaterialTheme.typography.titleLarge
        )
        Text(
            text = exploreState.error!!,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.error
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = { viewModel.retry() }) {
            Text("Retry")
        }
    }
}
// Empty State
else if (exploreState.services.isEmpty()) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "🔍",
                style = MaterialTheme.typography.displayLarge
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "No services found",
                style = MaterialTheme.typography.titleLarge
            )
        }
    }
}
// Success State
else {
    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(exploreState.services) { service ->
            ServiceListItem(
                service = service,
                onClick = { onServiceClick(service.id) }
            )
        }
    }
}
```

**Step 4: Update Price Displays**
```kotlin
Text(text = UiUtils.formatPrice(service.price))
```

---

## 3. OrdersScreen.kt Update

### Required Changes

**Step 1: Update Function Signature**
```kotlin
@Composable
fun OrdersScreen(
    viewModel: OrderViewModel = hiltViewModel(),  // ADD THIS
    onOrderClick: (String) -> Unit = {}
) {
```

**Step 2: Collect State**
```kotlin
val orderState by viewModel.orderState.collectAsState()
```

**Step 3: Replace Order List**

**BEFORE:**
```kotlin
val orders = DummyData.dummyOrders

LazyColumn {
    items(orders) { order ->
        OrderCard(order = order, onClick = { /* ... */ })
    }
}
```

**AFTER:**
```kotlin
// Loading State
if (orderState.isLoading) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        CircularProgressIndicator()
    }
}
// Error State
else if (orderState.error != null) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Failed to load orders",
            style = MaterialTheme.typography.titleLarge
        )
        Text(
            text = orderState.error!!,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.error
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = { viewModel.loadOrders() }) {
            Text("Retry")
        }
    }
}
// Empty State
else if (orderState.orders.isEmpty()) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "📦",
                style = MaterialTheme.typography.displayLarge
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "No orders yet",
                style = MaterialTheme.typography.titleLarge
            )
            Text(
                text = "Start browsing services to place your first order",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
            )
        }
    }
}
// Success State
else {
    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(orderState.orders) { order ->
            OrderCard(
                order = order,
                onClick = { onOrderClick(order.id) }
            )
        }
    }
}
```

**Step 4: Update Price Displays**
```kotlin
Text(text = UiUtils.formatPrice(order.totalAmount))
```

---

## 4. ServiceDetailsScreen.kt Update

### Required Changes

**Step 1: Ensure Real IDs are Used**

The ServiceDetailsScreen already receives a `serviceId` parameter. Make sure it's a real MongoDB ObjectId from the backend, not a dummy ID.

**Step 2: Update Order Now Button**

**BEFORE:**
```kotlin
Button(onClick = {
    onOrderNow(service.id, service.createdBy?.id ?: "")
})
```

**AFTER:**
```kotlin
Button(onClick = {
    // Ensure we're passing real MongoDB IDs
    val serviceId = service.id  // Real MongoDB _id
    val freelancerId = service.createdBy?.id ?: ""  // Real freelancer _id
    
    android.util.Log.d("ServiceDetails", "Order Now clicked")
    android.util.Log.d("ServiceDetails", "Service ID: $serviceId")
    android.util.Log.d("ServiceDetails", "Freelancer ID: $freelancerId")
    
    if (freelancerId.isBlank()) {
        // Show error toast
        Toast.makeText(context, "Freelancer information not available", Toast.LENGTH_SHORT).show()
    } else {
        onOrderNow(serviceId, freelancerId)
    }
})
```

**Step 3: Update Price Displays**
```kotlin
Text(text = UiUtils.formatPrice(service.price))
```

---

## 5. CreateOrderScreen.kt Update

### Required Changes

**Step 1: Verify IDs are Logged**

The CreateOrderScreen already logs IDs. Ensure the logs show real MongoDB ObjectIds:

```kotlin
android.util.Log.d("CreateOrder", "Service ID: $serviceId")  // Should be 24 hex chars
android.util.Log.d("CreateOrder", "Freelancer ID: $freelancerId")  // Should be 24 hex chars
```

**Step 2: Update Price Displays**
```kotlin
Text(text = UiUtils.formatPrice(service.price))
```

---

## 6. OrderDetailsScreen.kt Update

### Required Changes

**Step 1: Update Price Displays**

**BEFORE:**
```kotlin
Text(text = "$${order.totalAmount}")
```

**AFTER:**
```kotlin
Text(text = UiUtils.formatPrice(order.totalAmount))
```

---

## 7. Currency Update - Global Search & Replace

### Files to Update

Run these searches and replace all instances:

**Search Pattern 1:**
```
"$${service.price}"
"$${order.totalAmount}"
"$${freelancer.hourlyRate}"
```

**Replace With:**
```kotlin
UiUtils.formatPrice(service.price)
UiUtils.formatPrice(order.totalAmount)
UiUtils.formatPrice(freelancer.hourlyRate ?: 0.0)
```

**Search Pattern 2:**
```
"$$"
```

**Replace With:**
```
"₹"
```

### Files to Check
- HomeScreen.kt
- ExploreScreen.kt
- ServiceDetailsScreen.kt
- OrdersScreen.kt
- OrderDetailsScreen.kt
- CreateOrderScreen.kt
- FreelancerProfileScreen.kt
- TopFreelancersScreen.kt

---

## 8. Remove Dummy Data

### Step 1: Mark DummyData as Deprecated

**File:** `data/DummyData.kt`

**Add at top:**
```kotlin
@Deprecated(
    message = "Use real backend data instead. This is only for offline testing.",
    level = DeprecationLevel.WARNING
)
object DummyData {
    // ... existing code
}
```

### Step 2: Remove Dummy Data Imports

Search for:
```kotlin
import com.freelancex.data.DummyData
```

Remove from:
- HomeScreen.kt
- ExploreScreen.kt
- OrdersScreen.kt
- Any other files using dummy data

---

## 9. Add Required Imports

### Add to Each Updated Screen

```kotlin
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.LaunchedEffect
import com.freelancex.utils.UiUtils
import com.freelancex.presentation.viewmodel.HomeViewModel  // For HomeScreen
import com.freelancex.presentation.viewmodel.ExploreViewModel  // For ExploreScreen
import com.freelancex.presentation.viewmodel.OrderViewModel  // For OrdersScreen
```

---

## 10. Testing Checklist

### After Making Changes

**Test 1: Home Screen**
- [ ] App launches without crash
- [ ] Loading indicators show briefly
- [ ] Services load from backend
- [ ] Freelancers load from backend
- [ ] Prices show in ₹ format
- [ ] Service cards are clickable
- [ ] Freelancer cards are clickable
- [ ] Error state shows if backend is down
- [ ] Retry button works

**Test 2: Explore Screen**
- [ ] Services load from backend
- [ ] Search works
- [ ] Category filter works
- [ ] Loading state shows
- [ ] Empty state shows if no results
- [ ] Prices show in ₹ format
- [ ] Service cards are clickable

**Test 3: Orders Screen**
- [ ] Orders load from backend
- [ ] Loading state shows
- [ ] Empty state shows if no orders
- [ ] Order cards are clickable
- [ ] Prices show in ₹ format
- [ ] Status badges show correctly

**Test 4: Order Creation**
- [ ] Service Details shows real data
- [ ] Order Now button works
- [ ] CreateOrderScreen opens
- [ ] Real MongoDB IDs are logged
- [ ] Order creation succeeds
- [ ] Success toast shows
- [ ] Navigate to Orders screen
- [ ] New order appears in list

**Test 5: Currency**
- [ ] All prices show ₹ symbol
- [ ] Prices formatted correctly (₹15,000)
- [ ] No $ symbols anywhere

---

## 11. Debugging

### Check Logs

```bash
adb logcat | grep -E "HomeViewModel|ExploreViewModel|OrderViewModel|ServiceRepository|UserRepository|OrderRepository"
```

### Expected Logs

**Successful Load:**
```
D/ServiceRepository: Fetching services: category=null, page=1, limit=10
D/ServiceRepository: Services fetched successfully
D/HomeViewModel: Loaded 10 services
D/UserRepository: Fetching users: role=freelancer, page=1, limit=10
D/UserRepository: Users fetched successfully: 10 users
D/HomeViewModel: Loaded 10 freelancers
```

**Order Creation:**
```
D/OrderDebug: serviceId: 673e1234567890abcdef1234
D/OrderDebug: clientId: 673e5555666677778888999
D/OrderDebug: freelancerId: 673e9876543210fedcba9876
D/OrderDebug: Response code: 201
```

---

## 12. Common Issues & Solutions

### Issue 1: "No services available"
**Cause:** Backend has no services in database
**Solution:** Create test services in backend or seed database

### Issue 2: "Invalid order data"
**Cause:** Using dummy IDs instead of real MongoDB ObjectIds
**Solution:** Verify IDs in logs are 24 hex characters

### Issue 3: App crashes on launch
**Cause:** Missing ViewModel injection or state collection
**Solution:** Ensure `hiltViewModel()` is used and state is collected

### Issue 4: Prices show as "$0"
**Cause:** Price field is null or not populated
**Solution:** Check backend response includes price field

### Issue 5: "Failed to load services"
**Cause:** Backend is down or network error
**Solution:** Check backend URL and internet connection

---

## ✅ Completion Checklist

- [ ] HomeScreen updated with HomeViewModel
- [ ] ExploreScreen updated with ExploreViewModel
- [ ] OrdersScreen updated with OrderViewModel
- [ ] ServiceDetailsScreen uses real IDs
- [ ] CreateOrderScreen verified
- [ ] OrderDetailsScreen updated
- [ ] All $ replaced with ₹
- [ ] All prices use formatPrice()
- [ ] DummyData marked as deprecated
- [ ] All imports updated
- [ ] All tests passing
- [ ] End-to-end order creation works
- [ ] Logs show real MongoDB IDs
- [ ] No crashes or errors

---

**Date:** November 3, 2025
**Status:** 📝 IMPLEMENTATION GUIDE
**Next:** Apply these changes to each screen file
