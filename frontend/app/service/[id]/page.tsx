'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { servicesAPI } from '@/lib/api';
import OrderModal from '@/components/OrderModal';
import { Star, Clock, DollarSign, MapPin, Briefcase, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import EmptyState from '@/components/EmptyState';

export default function ServiceDetailsPage() {
  const params = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    loadService();
  }, [params.id]);

  const loadService = async () => {
    try {
      const data = await servicesAPI.getById(params.id as string);
      setService(data);
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyState
          icon="😕"
          title="Service not found"
          description="This service may have been removed or doesn't exist"
        >
          <Link href="/explore" className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Browse Services
          </Link>
        </EmptyState>
      </div>
    );
  }

  const freelancer = service.createdBy || service.freelancerId;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Image */}
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-96 object-cover rounded-lg mb-6"
            />

            {/* Title & Category */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm capitalize">
                  {service.category?.replace('-', ' ')}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h1>
              
              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{service.rating || 0}</span>
                  <span>({service.reviews?.length || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{service.deliveryTime}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">About This Service</h2>
              <p className="text-gray-700 whitespace-pre-line">{service.description}</p>
            </div>

            {/* Tags */}
            {service.tags && service.tags.length > 0 && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Reviews ({service.reviews?.length || 0})
              </h3>
              {service.reviews && service.reviews.length > 0 ? (
                <div className="space-y-4">
                  {service.reviews.map((review: any, idx: number) => (
                    <div key={idx} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.stars
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      {review.clientId && (
                        <p className="text-sm text-gray-500 mt-2">
                          by {review.clientId.name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg p-6 sticky top-4">
              {/* Price */}
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-1">Starting at</div>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  ${service.price}
                </div>
              </div>

              {/* Order Button */}
              <button
                onClick={() => setShowOrderModal(true)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold mb-4"
              >
                Order Now
              </button>

              {/* Service Details */}
              <div className="border-t pt-4 mb-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Delivery Time</span>
                  <span className="font-medium">{service.deliveryTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium capitalize">
                    {service.category?.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Orders</span>
                  <span className="font-medium">{service.orders || 0}</span>
                </div>
              </div>

              {/* Freelancer Info */}
              {freelancer && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">About the Seller</h4>
                  <Link
                    href={`/user/${freelancer._id}`}
                    className="flex items-center gap-3 mb-3 hover:bg-gray-50 p-2 rounded-lg transition"
                  >
                    <img
                      src={freelancer.profilePhoto || freelancer.avatar}
                      alt={freelancer.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{freelancer.name}</div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{freelancer.rating || 0}</span>
                        <span className="text-gray-500">
                          ({freelancer.completedOrders || 0} orders)
                        </span>
                      </div>
                    </div>
                  </Link>

                  {freelancer.bio && (
                    <p className="text-sm text-gray-600 mb-3">{freelancer.bio}</p>
                  )}

                  <div className="space-y-2 text-sm">
                    {freelancer.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{freelancer.location}</span>
                      </div>
                    )}
                    {freelancer.hourlyRate && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>${freelancer.hourlyRate}/hr</span>
                      </div>
                    )}
                    {freelancer.experience && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span>{freelancer.experience}</span>
                      </div>
                    )}
                  </div>

                  {freelancer.skills && freelancer.skills.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">Skills</div>
                      <div className="flex flex-wrap gap-1">
                        {freelancer.skills.slice(0, 5).map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/user/${freelancer._id}`}
                    className="block mt-4 text-center py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                  >
                    View Profile
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <OrderModal
          service={service}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </div>
  );
}