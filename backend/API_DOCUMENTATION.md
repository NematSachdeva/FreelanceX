# FreelanceX API Documentation

## Base URL
```
http://localhost:5001/api
```

## Authentication
Include JWT token in requests:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "freelancer" // or "client"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "freelancer"
  }
}
```

### Login User
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

## 👥 User Endpoints

### Get All Freelancers
```http
GET /api/users?page=1&limit=10&skills=JavaScript,React
```

### Get Freelancer by ID
```http
GET /api/users/:id
```

### Get Current User Profile
```http
GET /api/users/profile/me
```
*Requires authentication*

### Update User Profile
```http
PUT /api/users/profile
```
*Requires authentication*

**Body:**
```json
{
  "name": "Updated Name",
  "profile": {
    "bio": "Full-stack developer",
    "skills": ["JavaScript", "React", "Node.js"],
    "hourlyRate": 50,
    "location": "New York, USA"
  }
}
```

---

## 🛍️ Service Endpoints

### Get All Services
```http
GET /api/services?search=website&category=web-development&minPrice=100&maxPrice=500&page=1&limit=10
```

### Get Services by Category
```http
GET /api/services/category/:category
```

### Get Single Service
```http
GET /api/services/:id
```

### Create New Service
```http
POST /api/services
```
*Requires authentication*

**Body:**
```json
{
  "title": "Modern React Website Development",
  "description": "I will create a modern, responsive website using React.js",
  "category": "web-development",
  "price": 500,
  "deliveryTime": 7,
  "contactInfo": "john@example.com",
  "tags": ["React", "JavaScript", "Responsive"],
  "images": ["https://example.com/image.jpg"]
}
```

### Update Service
```http
PUT /api/services/:id
```
*Requires authentication (owner only)*

### Delete Service
```http
DELETE /api/services/:id
```
*Requires authentication (owner only)*

---

## 📋 Order Endpoints

### Create New Order
```http
POST /api/orders
```
*Requires authentication*

**Body:**
```json
{
  "serviceId": "service_id_here",
  "requirements": "I need a modern e-commerce website with payment integration",
  "deliveryDate": "2024-01-15T00:00:00.000Z", // optional
  "paymentMethod": "credit-card" // optional
}
```

### Get User Orders
```http
GET /api/orders?type=buyer&status=pending&page=1&limit=10
```
*Requires authentication*

**Query Parameters:**
- `type`: "buyer", "seller", or "all" (default: "all")
- `status`: "pending", "accepted", "in-progress", "completed", "cancelled", "disputed"
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Get Single Order
```http
GET /api/orders/:id
```
*Requires authentication (buyer or seller only)*

### Update Order Status
```http
PUT /api/orders/:id/status
```
*Requires authentication (seller only)*

**Body:**
```json
{
  "status": "accepted" // or "in-progress", "completed", etc.
}
```

### Add Message to Order
```http
POST /api/orders/:id/messages
```
*Requires authentication (buyer or seller)*

**Body:**
```json
{
  "message": "Hi, I have a question about the project requirements."
}
```

### Add Rating and Review
```http
POST /api/orders/:id/rating
```
*Requires authentication (buyer only, order must be completed)*

**Body:**
```json
{
  "score": 5,
  "review": "Excellent work! Very professional and delivered on time."
}
```

---

## 📊 Data Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "client" | "freelancer",
  profile: {
    bio: String,
    skills: [String],
    hourlyRate: Number,
    location: String,
    avatar: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Service Model
```javascript
{
  title: String,
  description: String,
  category: String,
  price: Number,
  deliveryTime: Number,
  contactInfo: String,
  createdBy: ObjectId (User),
  tags: [String],
  images: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  service: ObjectId (Service),
  buyer: ObjectId (User),
  seller: ObjectId (User),
  status: "pending" | "accepted" | "in-progress" | "completed" | "cancelled" | "disputed",
  totalAmount: Number,
  requirements: String,
  deliveryDate: Date,
  deliverables: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: Date
  }],
  messages: [{
    sender: ObjectId (User),
    message: String,
    timestamp: Date
  }],
  paymentStatus: "pending" | "paid" | "refunded",
  paymentMethod: "credit-card" | "paypal" | "bank-transfer" | "crypto",
  rating: {
    score: Number (1-5),
    review: String,
    reviewedAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Frontend Integration Examples

### Registration
```javascript
const register = async (userData) => {
  const response = await fetch('http://localhost:5001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};
```

### Login
```javascript
const login = async (credentials) => {
  const response = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return response.json();
};
```

### Create Service
```javascript
const createService = async (serviceData, token) => {
  const response = await fetch('http://localhost:5001/api/services', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(serviceData)
  });
  return response.json();
};
```

### Create Order
```javascript
const createOrder = async (orderData, token) => {
  const response = await fetch('http://localhost:5001/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  return response.json();
};
```

---

## 🔍 Error Responses

### Validation Error (400)
```json
{
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "message": "No token provided, access denied"
}
```

### Not Found Error (404)
```json
{
  "message": "Service not found"
}
```

### Server Error (500)
```json
{
  "message": "Server error creating service"
}
```