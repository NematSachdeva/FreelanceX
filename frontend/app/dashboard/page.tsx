'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardAPI } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { 
  DollarSign, ShoppingBag, CheckCircle, Clock, 
  TrendingUp, Users, Package, Activity 
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = getToken();
      if (!token) {
        router.push('/auth/signin');
        return;
      }

      const data = await dashboardAPI.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadDashboard}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isFreelancer = stats?.user?.role === 'freelancer' || stats?.user?.accountType === 'freelancer';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {stats?.user?.name}!
          </p>
        </div>

        {/* Stats Cards */}
        {isFreelancer ? (
          <FreelancerDashboard stats={stats.freelancer} />
        ) : (
          <ClientDashboard stats={stats.client} />
        )}

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-md">
            {isFreelancer ? (
              <FreelancerActivity orders={stats.freelancer?.recentOrders || []} />
            ) : (
              <ClientActivity orders={stats.client?.recentOrders || []} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Freelancer Dashboard Component
function FreelancerDashboard({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Services"
        value={stats?.totalServices || 0}
        icon={<Package className="w-6 h-6" />}
        color="blue"
      />
      <StatCard
        title="Total Orders"
        value={stats?.totalOrders || 0}
        icon={<ShoppingBag className="w-6 h-6" />}
        color="green"
      />
      <StatCard
        title="Completed"
        value={stats?.completedOrders || 0}
        icon={<CheckCircle className="w-6 h-6" />}
        color="purple"
      />
      <StatCard
        title="Total Earnings"
        value={`$${stats?.totalEarnings || 0}`}
        icon={<DollarSign className="w-6 h-6" />}
        color="yellow"
      />
    </div>
  );
}

// Client Dashboard Component
function ClientDashboard({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Orders"
        value={stats?.totalOrders || 0}
        icon={<ShoppingBag className="w-6 h-6" />}
        color="blue"
      />
      <StatCard
        title="Active Orders"
        value={stats?.activeOrders || 0}
        icon={<Clock className="w-6 h-6" />}
        color="orange"
      />
      <StatCard
        title="Completed"
        value={stats?.completedOrders || 0}
        icon={<CheckCircle className="w-6 h-6" />}
        color="green"
      />
      <StatCard
        title="Total Spent"
        value={`$${stats?.totalSpent || 0}`}
        icon={<DollarSign className="w-6 h-6" />}
        color="purple"
      />
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Freelancer Activity Component
function FreelancerActivity({ orders }: { orders: any[] }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No recent orders yet
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {orders.map((order: any) => (
        <div key={order._id} className="p-6 hover:bg-gray-50 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={order.buyer?.avatar || 'https://ui-avatars.com/api/?name=User'}
                alt={order.buyer?.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-medium text-gray-900">{order.service?.title}</h3>
                <p className="text-sm text-gray-600">
                  Order from {order.buyer?.name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">${order.totalAmount}</p>
              <span className={`inline-block px-2 py-1 text-xs rounded ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Client Activity Component
function ClientActivity({ orders }: { orders: any[] }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No recent orders yet
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {orders.map((order: any) => (
        <div key={order._id} className="p-6 hover:bg-gray-50 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={order.service?.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100'}
                alt={order.service?.title}
                className="w-10 h-10 rounded object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900">{order.service?.title}</h3>
                <p className="text-sm text-gray-600">
                  Seller: {order.seller?.name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">${order.totalAmount}</p>
              <span className={`inline-block px-2 py-1 text-xs rounded ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}