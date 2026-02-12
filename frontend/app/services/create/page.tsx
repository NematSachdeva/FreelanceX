'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { servicesAPI } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CreateServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    deliveryTime: '',
    image: '',
    tags: [] as string[],
    requirements: ''
  });
  const [newTag, setNewTag] = useState('');

  const categories = [
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

  const deliveryOptions = [
    { value: '1 day', label: '1 Day' },
    { value: '3 days', label: '3 Days' },
    { value: '5 days', label: '5 Days' },
    { value: '1 week', label: '1 Week' },
    { value: '2 weeks', label: '2 Weeks' },
    { value: '3 weeks', label: '3 Weeks' },
    { value: '1 month', label: '1 Month' }
  ];

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/auth/signin');
      return;
    }
    
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    
    // Check if user is a freelancer
    if (userData.role !== 'freelancer' && userData.accountType !== 'freelancer') {
      toast.error('Only freelancers can create services');
      router.push('/dashboard');
      return;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price),
        tags: formData.tags.filter(tag => tag.trim() !== '')
      };

      await servicesAPI.create(serviceData);
      
      toast.success('Service created successfully! 🎉');
      router.push('/dashboard/seller');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/dashboard/seller')}
            className="p-2 hover:bg-accent rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Service</h1>
            <p className="text-muted-foreground">Share your skills and start earning</p>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Basic Information */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="I will create a modern website for your business"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="500"
                  min="1"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Delivery Time *
                </label>
                <select
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select delivery time</option>
                  {deliveryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Service Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Add a URL to an image that represents your service
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Service Description</h2>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your service in detail. What will you deliver? What makes your service unique?"
                rows={6}
                required
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Tags</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag (e.g., React, WordPress, Logo Design)"
                  className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-primary/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Requirements from Buyer</h2>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                What do you need from the buyer to get started?
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Please provide your brand colors, logo, content, and any specific requirements..."
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/seller')}
              className="flex-1 px-6 py-3 border border-border text-muted-foreground rounded-lg hover:bg-accent transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Service...' : 'Create Service'}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}