'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { PlusIcon, PencilIcon, TrashIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

export default function SkillsManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 1,
    icon: '',
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin');
      return;
    }
    fetchSkills();
  }, [session, status, router]);

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/admin/skills');
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingSkill ? `/api/admin/skills/${editingSkill.id}` : '/api/admin/skills';
      const method = editingSkill ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchSkills();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus skill ini?')) return;
    
    try {
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchSkills();
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon || '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSkill(null);
    setFormData({
      name: '',
      category: '',
      level: 1,
      icon: '',
    });
  };

  const categories = Array.from(new Set(skills.map(skill => skill.category))).filter(Boolean);

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
            <h1 className="text-3xl font-bold text-gray-900">Skills Management</h1>
            <p className="text-gray-600">Kelola keahlian dan skill Anda</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Tambah Skill</span>
          </button>
        </div>

        {/* Skills by Category */}
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category} className="bg-white shadow-lg rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{category}</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skills.filter(skill => skill.category === category).map(skill => (
                    <div key={skill.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{skill.name}</h3>
                          <div className="flex items-center mt-2">
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map(level => (
                                <div
                                  key={level}
                                  className={`h-2 w-4 rounded ${
                                    level <= skill.level ? 'bg-blue-500' : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-500">{skill.level}/5</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(skill)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(skill.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingSkill ? 'Edit Skill' : 'Tambah Skill Baru'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Skill *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="React.js"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Frontend"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level (1-5) *
                  </label>
                  <select
                    required
                    value={formData.level}
                    onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map(level => (
                      <option key={level} value={level}>
                        Level {level} {level === 1 ? '(Beginner)' : level === 5 ? '(Expert)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon URL (Opsional)
                  </label>
                  <input
                    type="url"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/icon.svg"
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
                    {editingSkill ? 'Update' : 'Tambah'} Skill
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