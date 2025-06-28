'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { PlusIcon, PencilIcon, TrashIcon, BuildingOfficeIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface Organization {
  id: string;
  name: string;
  position: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  createdAt: string;
}

export default function OrganizationsManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin');
      return;
    }
    fetchOrganizations();
  }, [session, status, router]);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/admin/organizations');
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingOrganization ? `/api/admin/organizations/${editingOrganization.id}` : '/api/admin/organizations';
      const method = editingOrganization ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          endDate: formData.current ? null : formData.endDate || null,
        }),
      });

      if (response.ok) {
        await fetchOrganizations();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error saving organization:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus organisasi ini?')) return;
    
    try {
      const response = await fetch(`/api/admin/organizations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchOrganizations();
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
  };

  const handleEdit = (org: Organization) => {
    setEditingOrganization(org);
    setFormData({
      name: org.name,
      position: org.position,
      startDate: org.startDate.split('T')[0],
      endDate: org.endDate ? org.endDate.split('T')[0] : '',
      current: org.current,
      description: org.description || '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingOrganization(null);
    setFormData({
      name: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
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
            <h1 className="text-3xl font-bold text-gray-900">Organizations Management</h1>
            <p className="text-gray-600">Kelola pengalaman organisasi Anda</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Tambah Organisasi</span>
          </button>
        </div>

        {/* Organizations List */}
        <div className="space-y-6">
          {organizations.map(org => (
            <div key={org.id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <BuildingOfficeIcon className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{org.name}</h3>
                      <p className="text-lg text-blue-600">{org.position}</p>
                    </div>
                    {org.current && (
                      <span className="ml-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(org.startDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })} - 
                      {org.current ? ' Present' : org.endDate ? new Date(org.endDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : ' Present'}
                    </span>
                  </div>
                  
                  {org.description && (
                    <p className="text-gray-700">{org.description}</p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(org)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(org.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingOrganization ? 'Edit Organisasi' : 'Tambah Organisasi Baru'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Organisasi *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Himpunan Mahasiswa Teknik Informatika"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Posisi/Jabatan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ketua Divisi Teknologi"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Mulai *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {!formData.current && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal Selesai
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="current"
                    checked={formData.current}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      current: e.target.checked,
                      endDate: e.target.checked ? '' : prev.endDate
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="current" className="ml-2 block text-sm text-gray-700">
                    Saat ini masih aktif di organisasi ini
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi & Pencapaian
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Deskripsi tanggung jawab dan pencapaian di organisasi..."
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
                    {editingOrganization ? 'Update' : 'Tambah'} Organisasi
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