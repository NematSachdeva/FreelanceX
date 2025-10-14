'use client';

import React, { useState, useEffect } from 'react';
import { authAPI, servicesAPI, ordersAPI } from '../lib/api';
import { getUser, getToken } from '../lib/auth';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    services: 0,
    orders: 0,
    loading: true
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Get current user
        const currentUser = getUser();
        setUser(currentUser);

        if (!currentUser) return;

        // Load user stats
        const [servicesResult, ordersResult] = await Promise.all([
          servicesAPI.getAll({ limit: 5 }),
          ordersAPI.getUserOrders({ limit: 5 })
        ]);

        setStats({
          services: servicesResult.total || 0,
          orders: ordersResult.total || 0,
          loading: false
        });

        // Set recent activity
        const activity = [];
        if (servicesResult.services) {
          servicesResult.services.forEach(service => {
            activity.push({
              type: 'service',
              title: service.title,
              date: service.createdAt,
              status: service.isActive ? 'active' : 'inactive'
            });
          });
        }
        if (ordersResult.orders) {
          ordersResult.orders.forEach(order => {
            activity.push({
              type: 'order',
              title: `Order for ${order.service?.title}`,
              date: order.createdAt,
              status: order.status
            });
          });
        }

        // Sort by date
        activity.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentActivity(activity.slice(0, 5));

      } catch (error) {
        console.error('Dashboard load error:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    loadDashboard();
  }, []);

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600">
          Role: <span className="capitalize font-medium">{user.role}</span>
        </p>
        <p className="text-gray-600">
          Email: {user.email}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {user.role === 'freelancer' ? 'My Services' : 'Available Services'}
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.loading ? '...' : stats.services}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {user.role === 'freelancer' ? 'Orders Received' : 'Orders Placed'}
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.loading ? '...' : stats.orders}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Account Status
          </h3>
          <p className="text-lg font-medium text-green-600">
            ✅ Active
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">
                    {activity.type === 'service' ? '📋 Service' : '🛒 Order'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    activity.status === 'active' || activity.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : activity.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No recent activity</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.role === 'freelancer' ? (
            <>
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                <h4 className="font-medium text-gray-900">Create New Service</h4>
                <p className="text-sm text-gray-600">Add a new service to your portfolio</p>
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                <h4 className="font-medium text-gray-900">View Orders</h4>
                <p className="text-sm text-gray-600">Check your incoming orders</p>
              </button>
            </>
          ) : (
            <>
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                <h4 className="font-medium text-gray-900">Browse Services</h4>
                <p className="text-sm text-gray-600">Find freelancers for your project</p>
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                <h4 className="font-medium text-gray-900">My Orders</h4>
                <p className="text-sm text-gray-600">Track your active orders</p>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;