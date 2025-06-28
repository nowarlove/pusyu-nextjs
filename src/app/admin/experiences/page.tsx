'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { PlusIcon, PencilIcon, TrashIcon, BriefcaseIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  skills: string[];
  createdAt: string;
}

export default function ExperienceManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    skills: [] as string[],
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin');
      return;
    }
    fetchExperiences();
  }, [session, status, router]);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/admin/experiences');
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingExperience ? `/api/admin/experiences/${editingExperience.id}` : '/api/admin/experiences';
      const method = editingExperience ? 'PUT' : 'POST';
      
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
        await fetchExperiences();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengalaman kerja ini?')) return;
    
    try {
      const response = await fetch(`/api/admin/experiences/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchExperiences();
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingExperience(exp);
    setFormData({
      company: exp.company,
      position: exp.position,
      location: exp.location || '',
      startDate: exp.startDate.split('T')[0],
      endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
      current: exp.current,
      description: exp.description || '',
      skills: exp.skills || [],
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExperience(null);
    setFormData({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      skills: [],
    });
    setSkillInput('');
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
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
            <h1 className="text-3xl font-bold text-gray-900">Experience Management</h1>
            <p className="text-gray-600">Kelola pengalaman kerja Anda</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Tambah Pengalaman</span>
          </button>
        </div>

        {/* Experience Timeline */}
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <BriefcaseIcon className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-lg text-blue-600">{exp.company}</p>
                    </div>
                    {exp.current && (
                      <span className="ml-4 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2 space-x-4">
                    {exp.location && (
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(exp.startDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })} - 
                        {exp.current ? ' Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : ' Present'}
                      </span>
                    </div>
                  </div>
                  
                  {exp.description && (
                    <p className="text-gray-700 mb-3">{exp.description}</p>
                  )}
                  
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map(skill => (
                        <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
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
                {editingExperience ? 'Edit Pengalaman' : 'Tambah Pengalaman Baru'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Perusahaan *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="PT. Tech Company"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posisi *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Full Stack Developer"
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
                      placeholder="Jakarta, Indonesia"
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
                    Saat ini masih bekerja di sini
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Pekerjaan
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Deskripsi tanggung jawab dan pencapaian..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills & Technologies
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="React.js"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map(skill => (
                      <span
                        key={skill}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
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
                    {editingExperience ? 'Update' : 'Tambah'} Pengalaman
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