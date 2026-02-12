'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { servicesAPI } from '@/lib/api';
import { Search, Filter, Star, Clock, DollarSign } from 'lucide-react';
import OrderModal from '@/components/OrderModal';
import { motion } from 'framer-motion';
import { ServiceCardSkeleton } from '@/components/SkeletonCard';
import EmptyState from '@/components/EmptyState';

export default function ExplorePage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    sortBy: 'newest'
  });
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'ui-ux-design', label: 'UI/UX Design' },
    { value: 'graphic-design', label: 'Graphic Design' },
    { value: 'digital-marketing', label: 'Digital Marketing' },
    { value: 'seo', label: 'SEO' },
    { value: 'content-writing', label: 'Content Writing' },
    { value: 'video-editing', label: 'Video Editing' },
    { value: 'data-analysis', label: 'Data Analysis' },
    { value: 'consulting', label: 'Consulting' }
  ];

  useEffect(() => {
    loadServices();
  }, [filters]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice > 0) params.minPrice = filters.minPrice;
      if (filters.maxPrice < 10000) params.maxPrice = filters.maxPrice;

      const result = await servicesAPI.getAll(params);
      let servicesData = result.services || [];

      // Sort services
      if (filters.sortBy === 'price-low') {
        servicesData.sort((a: any, b: any) => a.price - b.price);
      } else if (filters.sortBy === 'price-high') {
        servicesData.sort((a: any, b: any) => b.price - a.price);
      } else if (filters.sortBy === 'rating') {
        servicesData.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
      }

      setServices(servicesData);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (service: any) => {
    setSelectedService(service);
    setShowOrderModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Explore Services</h1>
          <p className="text-muted-foreground">Find the perfect freelancer for your project</p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Price Range: ₹{filters.minPrice} - ₹{filters.maxPrice}
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value) })}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {loading ? 'Loading...' : `${services.length} services found`}
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No services found"
            description="Try adjusting your filters or search terms to find what you're looking for"
            action={{
              label: 'Clear Filters',
              onClick: () => setFilters({ search: '', category: '', minPrice: 0, maxPrice: 10000, sortBy: 'newest' })
            }}
          />
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {services.map((service) => (
              <motion.div
                key={service._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-card rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden group border"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                    {service.title}
                  </h3>
                  
                  {/* Freelancer Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={service.createdBy?.profilePhoto || service.createdBy?.avatar}
                      alt={service.createdBy?.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-muted-foreground">{service.createdBy?.name}</span>
                  </div>

                  {/* Rating & Delivery */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{service.rating || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{service.deliveryTime}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-muted-foreground">Starting at</div>
                    <div className="text-xl font-bold text-foreground">₹{service.price}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/service/${service._id}`}
                      className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition text-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleOrderClick(service)}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedService && (
        <OrderModal
          service={selectedService}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
}