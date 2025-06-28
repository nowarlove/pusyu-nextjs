"use client";

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { socialMediaSchema } from '@/lib/validations/admin';
import { z } from 'zod';

type SocialMediaFormData = z.infer<typeof socialMediaSchema>;

interface SocialMedia {
  id: string;
  platform: string;
  username: string;
  url: string;
  icon?: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSocialMediaPage() {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSocialMedia, setEditingSocialMedia] = useState<SocialMedia | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<SocialMediaFormData>({
    resolver: zodResolver(socialMediaSchema)
  });

  // Platform options
  const platformOptions = [
    { value: 'GitHub', icon: Github },
    { value: 'LinkedIn', icon: Linkedin },
    { value: 'Twitter', icon: Twitter },
    { value: 'Instagram', icon: Instagram },
    { value: 'Website', icon: Globe },
    { value: 'Other', icon: ExternalLink }
  ];

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    const platformOption = platformOptions.find(p => p.value.toLowerCase() === platform.toLowerCase());
    return platformOption?.icon || ExternalLink;
  };

  // Fetch social media
  const fetchSocialMedia = async () => {
    try {
      const response = await fetch('/api/admin/social-media');
      if (response.ok) {
        const data = await response.json();
        setSocialMedia(data);
      }
    } catch (error) {
      console.error('Error fetching social media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  // Handle form submission
  const onSubmit = async (data: SocialMediaFormData) => {
    try {
      const url = editingSocialMedia 
        ? `/api/admin/social-media/${editingSocialMedia.id}`
        : '/api/admin/social-media';
      
      const method = editingSocialMedia ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        await fetchSocialMedia();
        handleCloseModal();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error saving social media:', error);
      alert('Error saving social media');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social media link?')) return;

    try {
      const response = await fetch(`/api/admin/social-media/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchSocialMedia();
      } else {
        alert('Error deleting social media');
      }
    } catch (error) {
      console.error('Error deleting social media:', error);
      alert('Error deleting social media');
    }
  };

  // Handle edit
  const handleEdit = (item: SocialMedia) => {
    setEditingSocialMedia(item);
    reset({
      platform: item.platform,
      username: item.username,
      url: item.url,
      icon: item.icon || '',
      order: item.order,
      active: item.active
    });
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSocialMedia(null);
    reset();
  };

  // Toggle active status
  const toggleActive = async (item: SocialMedia) => {
    try {
      const response = await fetch(`/api/admin/social-media/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, active: !item.active })
      });

      if (response.ok) {
        await fetchSocialMedia();
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading social media...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Social Media</h1>
            <p className="text-gray-600">Manage your social media links</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus size={20} />
            Add Social Media
          </Button>
        </div>

        {/* Social Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialMedia.map((item) => {
            const IconComponent = getPlatformIcon(item.platform);
            
            return (
              <Card key={item.id} className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.platform}</h3>
                      <p className="text-gray-600 text-sm">{item.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={item.active ? "success" : "secondary"}>
                      {item.active ? "Active" : "Inactive"}
                    </Badge>
                    <button
                      onClick={() => toggleActive(item)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {item.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                  >
                    {item.url}
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="flex-1 gap-1"
                  >
                    <Edit size={14} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:bg-red-50 gap-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>

                {/* Order indicator */}
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                  {item.order}
                </div>
              </Card>
            );
          })}
        </div>

        {socialMedia.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ExternalLink size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No social media links</h3>
            <p className="text-gray-600">Get started by adding your first social media link</p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingSocialMedia ? 'Edit Social Media' : 'Add Social Media'}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Platform */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform *
                    </label>
                    <select
                      {...register('platform')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select platform</option>
                      {platformOptions.map((platform) => (
                        <option key={platform.value} value={platform.value}>
                          {platform.value}
                        </option>
                      ))}
                    </select>
                    {errors.platform && (
                      <p className="text-red-500 text-sm mt-1">{errors.platform.message}</p>
                    )}
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                    </label>
                    <input
                      {...register('username')}
                      placeholder="@username or display name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                    )}
                  </div>

                  {/* URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL *
                    </label>
                    <input
                      {...register('url')}
                      type="url"
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.url && (
                      <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
                    )}
                  </div>

                  {/* Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      {...register('order', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Active */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('active')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Active (show on website)
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? 'Saving...' : editingSocialMedia ? 'Update' : 'Create'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseModal}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}