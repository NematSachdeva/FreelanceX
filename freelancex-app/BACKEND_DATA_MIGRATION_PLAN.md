# 🔄 Backend Data Migration Plan

## 📋 Overview

**Goal:** Replace all dummy data with real backend data to fix order creation and enable full backend integration.

**Status:** 📝 PLANNING
**Priority:** 🔴 CRITICAL
**Estimated Effort:** 4-6 hours

---

## ⚠️ Current Problem

**Issue:** App uses dummy data (DummyData.kt) with fake IDs like:
- `serviceId: "service_1"`
- `freelancerId: "freelancer_1"`
- `userId: "user_1"`

**Backend Requires:** Real MongoDB ObjectIds like:
- `serviceId: "673e1234567890abcdef1234"`
- `freelancerId: "673e9876543210fedcba9876"`
- `clientId: "673e5555666677778888999"`

**Result:** Order creation fails with "Invalid order data"

---

## 🎯 Implementation Tasks

### Phase 1: API Integration (Priority: HIGH)

#### 1.1 Create Service Repository & ViewModel

**Files to Create:**
- `domain/repository/ServiceRepository.kt`
- `data/repository/ServiceRepositoryImpl.kt`
- `presentation/viewmodel/ServiceViewModel.kt`

**API Endpoints:**
```kotlin
interface ServiceRepository {
    suspend fun getServices(
        category: String? = null,
        page: Int = 1,
        limit: Int = 20
    ): Resource<ServicesResponse>
    
    suspend fun getServiceById(serviceId: String): Resource<Service>
    
    suspend fun searchServices(query: String): Resource<ServicesResponse>
}
```

**Backend Endpoints:**
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `GET /api/search/services?q=query` - Search services

---

#### 1.2 Create User/Freelancer Repository & ViewModel

**Files to Create:**
- `domain/repository/UserRepository.kt`
- `data/repository/UserRepositoryImpl.kt`
- `presentation/viewmodel/UserViewModel.kt`

**API Endpoints:**
```kotlin
interface UserRepository {
    suspend fun getUsers(
        role: String? = null,
        page: Int = 1,
        limit: Int = 20
    ): Resource<UsersResponse>
    
    suspend fun getUserById(userId: String): Resource<User>
    
    suspend fun getCurrentUser(): Resource<User>
}
```

**Backend Endpoints:**
- `GET /api/users?role=freelancer` - Get freelancers
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/me` - Get current user

---

### Phase 2: Update Home Screen (Priority: HIGH)

#### 2.1 Update HomeScreen.kt

**Changes:**
```kotlin
@Composable
fun HomeScreen(
    viewModel: ServiceViewModel = hiltViewModel(),
    userViewModel: UserViewModel = hiltViewModel(),
    onNavigateToExplore: (category: String?) -> Unit = {},
    onNavigateToService: (String) -> Unit = {},
    onNavigateToFreelancer: (String) -> Unit = {},
    onNavigateToTopFreelancers: () -> Unit = {}
) {
    val servicesState by viewModel.servicesState.collectAsState()
    val freelancersState by userViewModel.freelancersState.collectAsState()
    
    LaunchedEffect(Unit) {
        viewModel.loadServices()
        userViewModel.loadFreelancers()
    }
    
    // Use servicesState.services instead of DummyData.dummyServices
    // Use freelancersState.freelancers instead of DummyData.dummyFreelancers
}
```

**Display Real Data:**
- Featured Services: `servicesState.services.take(5)`
- Top Freelancers: `freelancersState.freelancers.take(5)`
- Loading states: Show shimmer/skeleton
- Error states: Show error message with retry

---

#### 2.2 Update ExploreScreen.kt

**Changes:**
```kotlin
@Composable
fun ExploreScreen(
    category: String? = null,
    viewModel: ServiceViewModel = hiltViewModel(),
    onServiceClick: (String) -> Unit = {}
) {
    val servicesState by viewModel.servicesState.collectAsState()
    
    LaunchedEffect(category) {
        viewModel.loadServices(category = category)
    }
    
    // Use servicesState.services instead of DummyData.dummyServices
}
```

---

### Phase 3: Update Service Details (Priority: HIGH)

#### 3.1 Update ServiceDetailsScreen.kt

**Changes:**
```kotlin
@Composable
fun ServiceDetailsScreen(
    serviceId: String,
    viewModel: ServiceViewModel = hiltViewModel(),
    onNavigateBack: () -> Unit,
    onOrderNow: (String, String) -> Unit = { _, _ -> }
) {
    val serviceState by viewModel.serviceDetailsState.collectAsState()
    
    LaunchedEffect(serviceId) {
        viewModel.loadServiceDetails(serviceId)
    }
    
    when {
        serviceState.isLoading -> LoadingScreen()
        serviceState.error != null -> ErrorScreen(serviceState.error!!)
        serviceState.service != null -> {
            val service = serviceState.service!!
            // Display service details
            // Order Now button:
            Button(onClick = {
                onOrderNow(
                    service.id,  // Real MongoDB _id
                    service.createdBy?.id ?: ""  // Real freelancer _id
                )
            })
        }
    }
}
```

---

### Phase 4: Update Orders Screen (Priority: HIGH)

#### 4.1 Update OrdersScreen.kt

**Changes:**
```kotlin
@Composable
fun OrdersScreen(
    viewModel: OrderViewModel = hiltViewModel()
) {
    val orderState by viewModel.orderState.collectAsState()
    
    LaunchedEffect(Unit) {
        viewModel.loadOrders()
    }
    
    // Use orderState.orders instead of DummyData.dummyOrders
}
```

**OrderViewModel already exists, just needs:**
```kotlin
init {
    loadOrders()
}
```

---

### Phase 5: Update Data Models (Priority: MEDIUM)

#### 5.1 Ensure Service Model Matches Backend

**File:** `data/model/Service.kt`

**Required Fields:**
```kotlin
data class Service(
    @SerializedName("_id")
    val id: String,
    
    @SerializedName("title")
    val title: String,
    
    @SerializedName("description")
    val description: String,
    
    @SerializedName("price")
    val price: Double,
    
    @SerializedName("category")
    val category: String,
    
    @SerializedName("rating")
    val rating: Double = 0.0,
    
    @SerializedName("reviewCount")
    val reviewCount: Int = 0,
    
    @SerializedName("image")
    val image: String? = null,
    
    @SerializedName("createdBy")
    val createdBy: User? = null,  // Populated freelancer
    
    @SerializedName("createdAt")
    val createdAt: Long = 0,
    
    @SerializedName("updatedAt")
    val updatedAt: Long = 0
)
```

---

#### 5.2 Ensure User Model Matches Backend

**File:** `data/model/User.kt`

**Required Fields:**
```kotlin
data class User(
    @SerializedName("_id")
    val id: String,
    
    @SerializedName("name")
    val name: String,
    
    @SerializedName("email")
    val email: String,
    
    @SerializedName("role")
    val role: String,  // "client" or "freelancer"
    
    @SerializedName("avatar")
    val avatar: String? = null,
    
    @SerializedName("bio")
    val bio: String? = null,
    
    @SerializedName("skills")
    val skills: List<String> = emptyList(),
    
    @SerializedName("rating")
    val rating: Double = 0.0,
    
    @SerializedName("completedOrders")
    val completedOrders: Int = 0,
    
    @SerializedName("hourlyRate")
    val hourlyRate: Double? = null,
    
    @SerializedName("location")
    val location: String? = null
)
```

---

### Phase 6: Currency Update (Priority: LOW)

#### 6.1 Replace $ with ₹

**Files to Update:**
- All screen files that display prices
- `UiUtils.kt` - Add currency formatter

**Add Utility Function:**
```kotlin
// In UiUtils.kt
fun formatPrice(price: Double): String {
    return "₹${String.format("%,.0f", price)}"
}

// Usage
Text(text = formatPrice(service.price))
```

**Search and Replace:**
```bash
# Find all $ references
grep -r "\$" app/src/main/java/com/freelancex/presentation/

# Replace with ₹
```

---

### Phase 7: Remove Dummy Data (Priority: LOW)

#### 7.1 Deprecate DummyData.kt

**File:** `data/DummyData.kt`

**Options:**
1. Delete the file entirely
2. Keep for offline mode/testing
3. Mark as deprecated

**Recommendation:** Keep for now, mark as deprecated:
```kotlin
@Deprecated("Use real backend data instead")
object DummyData {
    // ... existing code
}
```

---

## 📊 API Response Examples

### GET /api/services

**Response:**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "_id": "673e1234567890abcdef1234",
        "title": "Modern Website Design",
        "description": "Complete responsive website...",
        "price": 15000,
        "category": "web-development",
        "rating": 4.9,
        "reviewCount": 127,
        "image": "https://...",
        "createdBy": {
          "_id": "673e9876543210fedcba9876",
          "name": "Alex Sharma",
          "email": "alex@example.com",
          "role": "freelancer",
          "rating": 4.9,
          "completedOrders": 127,
          "skills": ["React", "Node.js", "MongoDB"]
        },
        "createdAt": 1699000000000,
        "updatedAt": 1699000000000
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

### GET /api/users?role=freelancer

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "673e9876543210fedcba9876",
        "name": "Alex Sharma",
        "email": "alex@example.com",
        "role": "freelancer",
        "avatar": "https://...",
        "bio": "Full-stack developer...",
        "skills": ["React", "Node.js", "MongoDB"],
        "rating": 4.9,
        "completedOrders": 127,
        "hourlyRate": 1200,
        "location": "Mumbai, India"
      }
    ]
  }
}
```

### GET /api/orders

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "_id": "673f1234567890abcdef5678",
        "serviceId": "673e1234567890abcdef1234",
        "clientId": "673e5555666677778888999",
        "freelancerId": "673e9876543210fedcba9876",
        "status": "pending",
        "totalAmount": 15000,
        "requirements": "I need a website...",
        "createdAt": 1699000000000,
        "updatedAt": 1699000000000
      }
    ]
  }
}
```

---

## 🧪 Testing Plan

### Test 1: Home Screen
- [ ] Services load from backend
- [ ] Freelancers load from backend
- [ ] Loading states show
- [ ] Error states show with retry
- [ ] Service cards clickable
- [ ] Freelancer cards clickable

### Test 2: Explore Screen
- [ ] Services load from backend
- [ ] Category filter works
- [ ] Search works
- [ ] Service cards clickable

### Test 3: Service Details
- [ ] Service loads from backend
- [ ] Freelancer info displays
- [ ] Order Now button works
- [ ] Passes real MongoDB IDs

### Test 4: Order Creation
- [ ] Real serviceId passed
- [ ] Real clientId from token
- [ ] Real freelancerId from service
- [ ] Order created successfully
- [ ] Order appears in MongoDB
- [ ] Order appears in Orders screen

### Test 5: Orders Screen
- [ ] Orders load from backend
- [ ] Order cards display correctly
- [ ] Order details work
- [ ] Contact freelancer works

---

## 📝 Implementation Checklist

### Phase 1: API Integration
- [ ] Create ServiceRepository interface
- [ ] Create ServiceRepositoryImpl
- [ ] Create ServiceViewModel
- [ ] Create UserRepository interface
- [ ] Create UserRepositoryImpl
- [ ] Create UserViewModel
- [ ] Add API endpoints to FreelanceXApi
- [ ] Test API calls with Postman/curl

### Phase 2: Home Screen
- [ ] Inject ServiceViewModel
- [ ] Inject UserViewModel
- [ ] Load services on init
- [ ] Load freelancers on init
- [ ] Display real services
- [ ] Display real freelancers
- [ ] Add loading states
- [ ] Add error states
- [ ] Test navigation

### Phase 3: Explore Screen
- [ ] Inject ServiceViewModel
- [ ] Load services on init
- [ ] Apply category filter
- [ ] Add search functionality
- [ ] Display real services
- [ ] Add loading states
- [ ] Add error states

### Phase 4: Service Details
- [ ] Inject ServiceViewModel
- [ ] Load service by ID
- [ ] Display service details
- [ ] Display freelancer info
- [ ] Update Order Now button
- [ ] Pass real MongoDB IDs
- [ ] Add loading states
- [ ] Add error states

### Phase 5: Orders Screen
- [ ] Update OrderViewModel init
- [ ] Load orders on init
- [ ] Display real orders
- [ ] Add loading states
- [ ] Add error states
- [ ] Test order details

### Phase 6: Currency
- [ ] Create formatPrice utility
- [ ] Replace $ with ₹ in all screens
- [ ] Test price display

### Phase 7: Cleanup
- [ ] Mark DummyData as deprecated
- [ ] Remove dummy data references
- [ ] Update documentation
- [ ] Test all flows end-to-end

---

## ⚠️ Important Notes

### Backend Requirements
1. **Services must exist in database**
   - Create test services via backend API
   - Or seed database with sample data

2. **Users must exist in database**
   - Register test users (freelancers)
   - Create services for those users

3. **JWT token must be valid**
   - User must be logged in
   - Token must not be expired

### Data Consistency
1. **Service.createdBy must be populated**
   - Backend should populate freelancer data
   - Or fetch freelancer separately

2. **All IDs must be valid MongoDB ObjectIds**
   - 24 hexadecimal characters
   - Format: `673e1234567890abcdef1234`

3. **Order creation requires existing entities**
   - Service must exist
   - Freelancer must exist
   - Client must exist

---

## 🚀 Quick Start (Minimal Implementation)

**For immediate testing, implement Phase 1-4 only:**

1. Create ServiceViewModel (fetch services)
2. Update HomeScreen to use real services
3. Update ServiceDetailsScreen to use real data
4. Test order creation with real IDs

**This will fix the immediate order creation issue.**

**Phases 5-7 can be done incrementally.**

---

## 📊 Estimated Timeline

| Phase | Task | Time | Priority |
|-------|------|------|----------|
| 1 | API Integration | 2 hours | HIGH |
| 2 | Home Screen | 1 hour | HIGH |
| 3 | Explore Screen | 1 hour | MEDIUM |
| 4 | Service Details | 1 hour | HIGH |
| 5 | Orders Screen | 30 min | HIGH |
| 6 | Currency Update | 30 min | LOW |
| 7 | Cleanup | 30 min | LOW |
| **Total** | | **6.5 hours** | |

---

## ✅ Success Criteria

**Order Creation Works:**
- [ ] User can browse real services
- [ ] User can click "Order Now"
- [ ] Order created with real MongoDB IDs
- [ ] Order appears in backend database
- [ ] Order appears in Orders screen
- [ ] No "Invalid order data" errors

**App Uses Real Data:**
- [ ] Home screen shows real services
- [ ] Home screen shows real freelancers
- [ ] Explore screen shows real services
- [ ] Service details show real data
- [ ] Orders screen shows real orders
- [ ] No dummy data used

**Currency Display:**
- [ ] All prices show ₹ (INR)
- [ ] No $ symbols anywhere
- [ ] Proper formatting (₹15,000)

---

## 📝 Summary

**This migration plan provides:**
1. Step-by-step implementation guide
2. Code examples for each phase
3. API endpoint documentation
4. Testing checklist
5. Timeline estimates

**Priority Order:**
1. Phase 1 & 4 (API + Service Details) - Fixes order creation
2. Phase 2 & 5 (Home + Orders) - Full user experience
3. Phase 3 & 6 (Explore + Currency) - Polish
4. Phase 7 (Cleanup) - Maintenance

**Start with Phases 1 & 4 to fix the immediate order creation issue, then implement the rest incrementally.**

---

**Date:** November 3, 2025
**Status:** 📝 PLANNING
**Next Step:** Implement Phase 1 (API Integration)
