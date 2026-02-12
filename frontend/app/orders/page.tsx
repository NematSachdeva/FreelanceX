'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ordersAPI } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Star, Clock, CheckCircle, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderCardSkeleton } from '@/components/SkeletonCard';
import EmptyState from '@/components/EmptyState';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [reviewModal, setReviewModal] = useState<any>(null);
  const [reviewData, setReviewData] = useState({ rating: 5, review: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/auth/signin');
      return;
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || user.accountType);
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const result = await ordersAPI.getUserOrders();
      setOrders(result.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (orderId: string) => {
    if (!confirm('Mark this order as completed?')) return;

    try {
      await ordersAPI.updateStatus(orderId, 'completed');
      toast.success('Order marked as completed! 🎉');
      loadOrders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete order');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await ordersAPI.addRating(reviewModal._id, {
        score: reviewData.rating,
        review: reviewData.review
      });
      
      toast.success('Review submitted successfully! ⭐');
      setReviewModal(null);
      setReviewData({ rating: 5, review: '' });
      loadOrders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>
        
        {orders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No orders yet"
            description={userRole === 'freelancer' 
              ? 'Orders from clients will appear here'
              : 'Start by ordering a service and connect with talented freelancers'
            }
          >
            {userRole !== 'freelancer' && (
              <Link
                href="/explore"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition mt-4"
              >
                Browse Services
              </Link>
            )}
          </EmptyState>
        ) : (
          <motion.div 
            className="space-y-4"
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
            {orders.map((order) => {
              const service = order.service || order.serviceId;
              const otherUser = userRole === 'freelancer' 
                ? (order.buyer || order.clientId)
                : (order.seller || order.freelancerId);

              return (
                <motion.div 
                  key={order.id} 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition border cursor-pointer"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  <div className="flex gap-4">
                    {/* Service Image */}
                    <img
                      src={service?.image || 'https://via.placeholder.com/150'}
                      alt={service?.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    {/* Order Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link
                            href={`/service/${service?._id}`}
                            className="font-semibold text-lg text-foreground hover:text-primary"
                          >
                            {service?.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {userRole === 'freelancer' ? 'Client' : 'Freelancer'}: {otherUser?.name}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {order.requirements}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">₹{order.totalAmount}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          {/* Freelancer Actions */}
                          {userRole === 'freelancer' && order.status === 'in-progress' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleComplete(order.id);
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Mark Complete
                            </button>
                          )}

                          {/* Client Actions */}
                          {userRole === 'client' && order.status === 'completed' && !order.rating && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setReviewModal(order);
                              }}
                              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
                            >
                              <Star className="w-4 h-4" />
                              Leave Review
                            </button>
                          )}

                          {/* Show Review if exists */}
                          {order.rating && (
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{order.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setReviewModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-popover rounded-lg max-w-md w-full p-6 border"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-popover-foreground">Leave a Review</h3>
                <button
                  onClick={() => setReviewModal(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            
            <form onSubmit={handleReviewSubmit}>
              {/* Rating */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-popover-foreground mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= reviewData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-popover-foreground mb-2">
                  Review (Optional)
                </label>
                <textarea
                  value={reviewData.review}
                  onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setReviewModal(null)}
                  className="flex-1 px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-accent"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}