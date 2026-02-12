'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect to appropriate dashboard based on user role
    const token = getToken();
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user.role || user.accountType;
    
    if (userRole === 'freelancer') {
      router.push('/dashboard/seller');
    } else {
      router.push('/dashboard/user');
    }
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}

