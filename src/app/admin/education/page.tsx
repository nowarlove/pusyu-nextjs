'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { PlusIcon, PencilIcon, TrashIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  description: string;
  gpa: string;
  createdAt: string;
}

export default function EducationManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    description: '',
    gpa: '',
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin');
      return;
    }
    fetchEducation();
  }, [session, status, router]);

  const fetchEducation = async () => {
    try {
      const response = await fetch('/api/admin/education');
      if (response.ok) {
        const data = await response.json();
        setEducation(data);
      }
    } catch (error) {
      console.error('Error fetching education:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingEducation ? `/api/admin/education/${editingEducation.id}` : '/api/admin/education';
      const method = editingEducation ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          endDate: formData.endDate || null,
        }),
      });

      if (response.ok) {
        await fetchEducation();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error saving education:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data pendidikan ini?')) return;
    
    try {
      const response = await fetch(`/api/admin/education/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchEducation();
      }
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingEducation(edu);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field || '',
      startDate: edu.startDate.split('T')[0],
      endDate: edu.endDate ? edu.endDate.split('T')[0] : '',
      description: edu.description || '',
      gpa: edu.gpa || '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEducation(null);
    setFormData({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
      gpa: '',
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
            <h1 className="text-3xl font-bold text-gray-900">Education Management</h1>
            <p className="text-gray-600">Kelola riwayat pendidikan Anda</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Tambah Pendidikan</span>
          </button>
        </div>

        {/* Education List */}
        <div className="space-y-6">
          {education.map(edu => (
            <div key={edu.id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <AcademicCapIcon className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-lg text-blue-600">{edu.institution}</p>
                    </div>
                  </div>
                  
                  {edu.field && (
                    <p className="text-gray-700 mb-2"><strong>Field:</strong> {edu.field}</p>
                  )}
                  
                  <p className="text-gray-600 mb-2">
                    <strong>Period:</strong> {new Date(edu.startDate).getFullYear()} - 
                    {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                  </p>
                  
                  {edu.gpa && (
                    <p className="text-gray-600 mb-3"><strong>GPA:</strong> {edu.gpa}</p>
                  )}
                  
                  {edu.description && (
                    <p className="text-gray-700">{edu.description}</p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(edu)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
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
                {editingEducation ? 'Edit Pendidikan' : 'Tambah Pendidikan Baru'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institusi *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.institution}
                      onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Universitas Indonesia"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gelar *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.degree}
                      onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Bachelor of Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bidang Studi
                    </label>
                    <input
                      type="text"
                      value={formData.field}
                      onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GPA
                    </label>
                    <input
                      type="text"
                      value={formData.gpa}
                      onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="3.8/4.0"
                    />
                  </div>

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
                    <p className="text-xs text-gray-500 mt-1">Kosongkan jika masih berlangsung</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Deskripsi singkat tentang pendidikan..."
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
                    {editingEducation ? 'Update' : 'Tambah'} Pendidikan
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