'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usersAPI } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { 
  User, Mail, MapPin, Briefcase, Github, Linkedin, 
  Globe, Edit, Save, X, Star, Award 
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    bio: '',
    location: '',
    skills: [] as string[],
    socialLinks: {
      github: '',
      linkedin: '',
      portfolio: '',
      twitter: ''
    },
    profile: {
      hourlyRate: 0
    }
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = getToken();
      if (!token) {
        router.push('/auth/signin');
        return;
      }

      const userData = await usersAPI.getCurrentUserProfile();
      setUser(userData);
      
      // Initialize form data
      setFormData({
        name: userData.name || '',
        avatar: userData.avatar || '',
        bio: userData.bio || '',
        location: userData.location || '',
        skills: userData.skills || [],
        socialLinks: userData.socialLinks || {
          github: '',
          linkedin: '',
          portfolio: '',
          twitter: ''
        },
        profile: {
          hourlyRate: userData.profile?.hourlyRate || 0
        }
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const result = await usersAPI.updateProfile(formData);
      setUser(result.user);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(result.user));
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    if (user) {
      setFormData({
        name: user.name || '',
        avatar: user.avatar || '',
        bio: user.bio || '',
        location: user.location || '',
        skills: user.skills || [],
        socialLinks: user.socialLinks || {},
        profile: {
          hourlyRate: user.profile?.hourlyRate || 0
        }
      });
    }
    setEditing(false);
    setError('');
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill]
      });
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load profile</p>
          <button 
            onClick={() => router.push('/auth/signin')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-4">
              <img
                src={editing ? formData.avatar : user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
              />
              <div>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-2xl font-bold border-b-2 border-blue-600 focus:outline-none"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                )}
                <p className="text-gray-600 capitalize">{user.role || user.accountType}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm">{user.profile?.rating || 0}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Award className="w-4 h-4" />
                    <span className="ml-1 text-sm">{user.profile?.completedProjects || 0} projects</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700">
              {success}
            </div>
          )}
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Mail className="w-5 h-5 mr-3 text-gray-400" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  {editing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Add location"
                      className="flex-1 border-b border-gray-300 focus:border-blue-600 focus:outline-none"
                    />
                  ) : (
                    <span>{user.location || 'Not specified'}</span>
                  )}
                </div>
                {(user.role === 'freelancer' || user.accountType === 'freelancer') && (
                  <div className="flex items-center text-gray-700">
                    <Briefcase className="w-5 h-5 mr-3 text-gray-400" />
                    {editing ? (
                      <input
                        type="number"
                        value={formData.profile.hourlyRate}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          profile: { ...formData.profile, hourlyRate: Number(e.target.value) }
                        })}
                        placeholder="Hourly rate"
                        className="flex-1 border-b border-gray-300 focus:border-blue-600 focus:outline-none"
                      />
                    ) : (
                      <span>₹{user.profile?.hourlyRate || 0}/hour</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Social Links</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Github className="w-5 h-5 mr-3 text-gray-400" />
                  {editing ? (
                    <input
                      type="text"
                      value={formData.socialLinks.github}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialLinks: { ...formData.socialLinks, github: e.target.value }
                      })}
                      placeholder="GitHub URL"
                      className="flex-1 border-b border-gray-300 focus:border-blue-600 focus:outline-none"
                    />
                  ) : (
                    user.socialLinks?.github ? (
                      <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {user.socialLinks.github}
                      </a>
                    ) : (
                      <span className="text-gray-400">Not added</span>
                    )
                  )}
                </div>
                <div className="flex items-center">
                  <Linkedin className="w-5 h-5 mr-3 text-gray-400" />
                  {editing ? (
                    <input
                      type="text"
                      value={formData.socialLinks.linkedin}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                      })}
                      placeholder="LinkedIn URL"
                      className="flex-1 border-b border-gray-300 focus:border-blue-600 focus:outline-none"
                    />
                  ) : (
                    user.socialLinks?.linkedin ? (
                      <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {user.socialLinks.linkedin}
                      </a>
                    ) : (
                      <span className="text-gray-400">Not added</span>
                    )
                  )}
                </div>
                <div className="flex items-center">
                  <Globe className="w-5 h-5 mr-3 text-gray-400" />
                  {editing ? (
                    <input
                      type="text"
                      value={formData.socialLinks.portfolio}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialLinks: { ...formData.socialLinks, portfolio: e.target.value }
                      })}
                      placeholder="Portfolio URL"
                      className="flex-1 border-b border-gray-300 focus:border-blue-600 focus:outline-none"
                    />
                  ) : (
                    user.socialLinks?.portfolio ? (
                      <a href={user.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {user.socialLinks.portfolio}
                      </a>
                    ) : (
                      <span className="text-gray-400">Not added</span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Bio */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">About</h2>
              {editing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={5}
                  className="w-full border border-gray-300 rounded p-2 focus:border-blue-600 focus:outline-none"
                />
              ) : (
                <p className="text-gray-700">{user.bio || 'No bio added yet.'}</p>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Skills</h2>
              {editing && (
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Add a skill and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSkill((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    className="w-full border border-gray-300 rounded p-2 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {(editing ? formData.skills : user.skills || []).map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                  >
                    {skill}
                    {editing && (
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
                {(!editing && (!user.skills || user.skills.length === 0)) && (
                  <p className="text-gray-400">No skills added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}