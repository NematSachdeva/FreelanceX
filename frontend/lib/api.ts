// FreelanceX API Integration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: async (userData) => {
    const result = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store token and user data
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    
    return result;
  },

  login: async (credentials) => {
    const result = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token and user data
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    
    return result;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

// Services API
export const servicesAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return apiCall(`/services?${params}`);
  },

  getById: async (id) => {
    return apiCall(`/services/${id}`);
  },

  getByCategory: async (category, filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return apiCall(`/services/category/${category}?${params}`);
  },

  create: async (serviceData) => {
    return apiCall('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  },

  update: async (id, serviceData) => {
    return apiCall(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  },

  delete: async (id) => {
    return apiCall(`/services/${id}`, {
      method: 'DELETE',
    });
  },
};

// Users API
export const usersAPI = {
  getFreelancers: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return apiCall(`/users?${params}`);
  },

  getById: async (id) => {
    return apiCall(`/users/${id}`);
  },

  getUserProfile: async (id) => {
    return apiCall(`/users/profile/${id}`);
  },

  getCurrentUserProfile: async () => {
    return apiCall('/users/profile/me');
  },

  updateProfile: async (profileData) => {
    return apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    return apiCall('/dashboard/stats');
  },

  getActivity: async (limit = 10) => {
    return apiCall(`/dashboard/activity?limit=${limit}`);
  },

  getEarnings: async (period = 'month') => {
    return apiCall(`/dashboard/earnings?period=${period}`);
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData) => {
    return apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getUserOrders: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return apiCall(`/orders?${params}`);
  },

  getById: async (id) => {
    return apiCall(`/orders/${id}`);
  },

  updateStatus: async (id, status) => {
    return apiCall(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  addMessage: async (id, message) => {
    return apiCall(`/orders/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  addRating: async (id, rating) => {
    return apiCall(`/orders/${id}/rating`, {
      method: 'POST',
      body: JSON.stringify(rating),
    });
  },
};

// Health check function
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error', message: error.message };
  }
};

// Axios-like API for backward compatibility
export const api = {
  post: async (endpoint, data) => {
    const result = await apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return { data: result };
  },
  
  get: async (endpoint) => {
    const result = await apiCall(endpoint);
    return { data: result };
  },
  
  put: async (endpoint, data) => {
    const result = await apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return { data: result };
  },
  
  delete: async (endpoint) => {
    const result = await apiCall(endpoint, {
      method: 'DELETE',
    });
    return { data: result };
  },
};

// Export all APIs
export default {
  authAPI,
  servicesAPI,
  usersAPI,
  ordersAPI,
  dashboardAPI,
  healthCheck,
  api,
};