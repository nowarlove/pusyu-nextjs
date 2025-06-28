'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, StarIcon } from '@heroicons/react/24/outline';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  category: string;
  featured: boolean;
  createdAt: string;
}

export default function ProjectsManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    technologies: [] as string[],
    githubUrl: '',
    liveUrl: '',
    category: '',
    featured: false,
  });
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin');
      return;
    }
    fetchProjects();
  }, [session, status, router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingProject ? `/api/admin/projects/${editingProject.id}` : '/api/admin/projects';
      const method = editingProject ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchProjects();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus project ini?')) return;
    
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      image: project.image || '',
      technologies: project.technologies || [],
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      category: project.category || '',
      featured: project.featured,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      technologies: [],
      githubUrl: '',
      liveUrl: '',
      category: '',
      featured: false,
    });
    setTechInput('');
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
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
            <h1 className="text-3xl font-bold text-gray-900">Projects Management</h1>
            <p className="text-gray-600">Kelola portfolio project Anda</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Tambah Project</span>
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded">
                    <StarIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{project.title}</h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {project.description || 'No description'}
                </p>
                
                {project.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-3">
                    {project.category}
                  </span>
                )}
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.slice(0, 3).map(tech => (
                      <span key={tech} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-gray-500 text-xs">+{project.technologies.length - 3} more</span>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <div className="flex space-x-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
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
                {editingProject ? 'Edit Project' : 'Tambah Project Baru'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Judul Project *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="E-Commerce Platform"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Web Application"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://project-demo.com"
                    />
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
                    placeholder="Deskripsi singkat tentang project..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technologies
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="React.js"
                    />
                    <button
                      type="button"
                      onClick={addTechnology}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map(tech => (
                      <span
                        key={tech}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Featured Project
                  </label>
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
                    {editingProject ? 'Update' : 'Tambah'} Project
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