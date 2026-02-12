'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ordersAPI } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare,
  Star,
  Upload,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/auth/signin');
      return;
    }
    
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    loadOrder();
  }, [params.id]);

  const loadOrder = async () => {
    try {
      console.log('🔍 Loading order with ID:', params.id);
      const result = await ordersAPI.getById(params.id as string);
      console.log('✅ Order loaded successfully:', result);
      console.log('👤 Current user:', user);
      setOrder(result);
    } catch (error) {
      console.error('❌ Error loading order:', error);
      toast.error('Failed to load order details');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!confirm(`Change order status to ${newStatus}?`)) return;

    try {
      await ordersAPI.updateStatus(order._id, newStatus);
      toast.success('Order status updated successfully! ✅');
      loadOrder();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    try {
      await ordersAPI.addMessage(order._id, newMessage.trim());
      setNewMessage('');
      toast.success('Message sent! 💬');
      loadOrder();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'disputed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      case 'disputed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const isFreelancer = user?.role === 'freelancer' || user?.accountType === 'freelancer';
  const isOrderOwner = order && user && (
    (order.buyer?._id === user._id || order.buyer?.id === user._id || order.buyer?._id === user.id) ||
    (order.seller?._id === user._id || order.seller?.id === user._id || order.seller?._id === user.id)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => router.push('/orders')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const otherUser = isFreelancer ? order.buyer : order.seller;
  const canUpdateStatus = isFreelancer && order.seller?._id === user?._id;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/orders')}
            className="p-2 hover:bg-accent rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Order Details</h1>
            <p className="text-muted-foreground">Order #{order._id.slice(-8)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Info */}
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Service Details</h2>
              <div className="flex gap-4">
                <img
                  src={order.service?.image || 'https://via.placeholder.com/150'}
                  alt={order.service?.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {order.service?.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {order.service?.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold text-foreground">₹{order.totalAmount}</span>
                    <span className="text-muted-foreground">
                      Due: {new Date(order.deliveryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Project Requirements</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {order.requirements}
              </p>
            </div>

            {/* Messages */}
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Messages
              </h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {order.messages?.length > 0 ? (
                  order.messages.map((message: any, index: number) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.sender._id === user._id ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <img
                        src={message.sender.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender.name)}`}
                        alt={message.sender.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender._id === user._id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No messages yet. Start the conversation!
                  </p>
                )}
              </div>

              {/* Send Message */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !newMessage.trim()}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {sendingMessage ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="font-semibold text-foreground mb-4">Order Status</h3>
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>

              {/* Status Update Actions for Freelancer */}
              {canUpdateStatus && (
                <div className="mt-4 space-y-2">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate('accepted')}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Accept Order
                    </button>
                  )}
                  {order.status === 'accepted' && (
                    <button
                      onClick={() => handleStatusUpdate('in-progress')}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      Start Work
                    </button>
                  )}
                  {order.status === 'in-progress' && (
                    <button
                      onClick={() => handleStatusUpdate('completed')}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Other User Info */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="font-semibold text-foreground mb-4">
                {isFreelancer ? 'Client' : 'Freelancer'}
              </h3>
              <div className="flex items-center gap-3">
                <img
                  src={otherUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || 'User')}`}
                  alt={otherUser?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{otherUser?.name}</p>
                  <p className="text-sm text-muted-foreground">{otherUser?.email}</p>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-card rounded-lg border p-6">
              <h3 className="font-semibold text-foreground mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-muted-foreground">
                    Order placed on {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {order.status !== 'pending' && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-muted-foreground">
                      Status: {order.status}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-muted-foreground">
                    Expected delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Rating Section (for completed orders) */}
            {order.status === 'completed' && !isFreelancer && !order.rating?.score && (
              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold text-foreground mb-4">Rate this Order</h3>
                <button
                  onClick={() => {
                    // This would open a rating modal
                    toast('Rating feature coming soon!');
                  }}
                  className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Leave Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}