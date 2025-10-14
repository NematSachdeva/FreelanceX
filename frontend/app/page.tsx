'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usersAPI, servicesAPI } from '@/lib/api';
import { Search, ArrowRight, Star, MapPin, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ServiceCardSkeleton } from '@/components/SkeletonCard';

export default function HomePage() {
  const [topFreelancers, setTopFreelancers] = useState<any[]>([]);
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [freelancersRes, servicesRes] = await Promise.all([
        usersAPI.getFreelancers({ limit: 6 }),
        servicesAPI.getAll({ limit: 6 })
      ]);
      
      setTopFreelancers(freelancersRes.freelancers || []);
      setFeaturedServices(servicesRes.services || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Web Development', icon: '💻', slug: 'web-development' },
    { name: 'UI/UX Design', icon: '🎨', slug: 'ui-ux-design' },
    { name: 'Digital Marketing', icon: '📱', slug: 'digital-marketing' },
    { name: 'Content Writing', icon: '✍️', slug: 'content-writing' },
    { name: 'Video Editing', icon: '🎬', slug: 'video-editing' },
    { name: 'SEO', icon: '🔍', slug: 'seo' },
    { name: 'Graphic Design', icon: '🖼️', slug: 'graphic-design' },
    { name: 'Data Analysis', icon: '📊', slug: 'data-analysis' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Hire the best freelancers, fast.
          </motion.h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Connect with talented professionals for your next project
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for services..."
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
                Search
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2">
                Hire Talent
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/become-seller">
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                Become a Seller
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/explore?category=${category.slug}`}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition text-center group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Freelancers Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Top Freelancers</h2>
            <Link href="/explore" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topFreelancers.map((freelancer) => (
                <Link
                  key={freelancer._id}
                  href={`/users/${freelancer._id}`}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition group"
                >
                  <div className="text-center">
                    <img
                      src={freelancer.profilePhoto || freelancer.avatar}
                      alt={freelancer.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100 group-hover:border-blue-300 transition"
                    />
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {freelancer.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{freelancer.rating || 0}</span>
                      <span className="text-sm text-gray-500">
                        ({freelancer.completedOrders || 0} orders)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                      {(freelancer.skills || []).slice(0, 3).map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>${freelancer.hourlyRate || 0}/hr</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Services</h2>
            <Link href="/explore" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <Link
                key={service._id}
                href={`/service/${service._id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={service.createdBy?.profilePhoto || service.createdBy?.avatar}
                      alt={service.createdBy?.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600">{service.createdBy?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{service.rating || 0}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Starting at</div>
                      <div className="text-lg font-bold text-gray-900">${service.price}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'John Smith',
                role: 'CEO, TechStart',
                image: 'https://randomuser.me/api/portraits/men/32.jpg',
                text: 'FreelanceX helped us find the perfect developer for our project. The quality of work was outstanding!'
              },
              {
                name: 'Sarah Johnson',
                role: 'Marketing Director',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                text: 'Amazing platform! Found a talented designer who brought our vision to life. Highly recommended!'
              },
              {
                name: 'Mike Davis',
                role: 'Startup Founder',
                image: 'https://randomuser.me/api/portraits/men/46.jpg',
                text: 'The freelancers on this platform are top-notch. Great communication and delivered on time!'
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of freelancers and clients on FreelanceX
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/join">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
                Sign Up Now
              </button>
            </Link>
            <Link href="/explore">
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                Browse Services
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}