'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import { PlusIcon, PencilIcon, TrashIcon, CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string | null;
  image: string | null;
  createdAt: string;
}

export default function ActivitiesManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image: '',
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin');
      return;
    }
    fetchActivities();
  }, [session, status, router]);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/admin/activities');
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingActivity ? `/api/admin/activities/${editingActivity.id}` : '/api/admin/activities';
      const method = editingActivity ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchActivities();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus aktivitas ini?')) return;
    
    try {
      const response = await fetch(`/api/admin/activities/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchActivities();
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description,
      date: activity.date.split('T')[0],
      location: activity.location || '',
      image: activity.image || '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingActivity(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      image: '',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activities Management</h1>
            <p className="text-gray-600">Kelola aktivitas dan kegiatan Anda</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Tambah Aktivitas</span>
          </button>
        </div>

        {/* Activities List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map(activity => (
            <div key={activity.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              {activity.image && (
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{activity.title}</h3>
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => handleEdit(activity)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(activity.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <CalendarDaysIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {new Date(activity.date).toLocaleDateString('id-ID', { 
                      day: 'numeric',
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                
                {activity.location && (
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">{activity.location}</span>
                  </div>
                )}
                
                <p className="text-gray-700 text-sm line-clamp-3">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>

        {activities.length === 0 && !loading && (
          <div className="text-center py-12">
            <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada aktivitas yang ditambahkan</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingActivity ? 'Edit Aktivitas' : 'Tambah Aktivitas Baru'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Aktivitas *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Workshop Web Development"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lokasi
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Jakarta Convention Center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Deskripsi detail tentang aktivitas ini..."
                  />
                </div>

                <div>
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                    label="Foto Aktivitas"
                    placeholder="Upload foto atau masukkan URL gambar"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingActivity ? 'Update' : 'Tambah'} Aktivitas
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}