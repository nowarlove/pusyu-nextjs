'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
  UserGroupIcon, 
  DocumentTextIcon, 
  BriefcaseIcon,
  AcademicCapIcon,
  ChartBarIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  Bars3Icon,
  UserIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalProjects: number;
  totalArticles: number;
  totalContacts: number;
  totalSkills: number;
  totalExperiences: number;
  totalEducation: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalArticles: 0,
    totalContacts: 0,
    totalSkills: 0,
    totalExperiences: 0,
    totalEducation: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/stats');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Gagal memuat statistik dashboard');
      // Set default values on error
      setStats({
        totalProjects: 0,
        totalArticles: 0,
        totalContacts: 0,
        totalSkills: 0,
        totalExperiences: 0,
        totalEducation: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: '/admin',
      redirect: true 
    });
  };

  const statCards = [
    {
      name: 'Total Projects',
      value: stats.totalProjects,
      icon: BriefcaseIcon,
      color: 'bg-blue-500',
      href: '/admin/projects'
    },
    {
      name: 'Total Articles',
      value: stats.totalArticles,
      icon: DocumentTextIcon,
      color: 'bg-green-500',
      href: '/admin/articles'
    },
    {
      name: 'Contact Messages',
      value: stats.totalContacts,
      icon: EnvelopeIcon,
      color: 'bg-yellow-500',
      href: '/admin/contacts'
    },
    {
      name: 'Skills',
      value: stats.totalSkills,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      href: '/admin/skills'
    },
    {
      name: 'Experiences',
      value: stats.totalExperiences,
      icon: UserGroupIcon,
      color: 'bg-indigo-500',
      href: '/admin/experiences'
    },
    {
      name: 'Education',
      value: stats.totalEducation,
      icon: AcademicCapIcon,
      color: 'bg-pink-500',
      href: '/admin/education'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Bars3Icon className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium px-3 py-2 rounded-md transition-colors"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Lihat Website
              </a>
              
              <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{session?.user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-500 hover:text-red-600 text-sm px-3 py-2 rounded-md transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Selamat datang kembali, {session?.user?.name}! 👋</h2>
          <p className="mt-2 text-gray-600">Berikut adalah ringkasan aktivitas portfolio Anda hari ini.</p>
          
          {error && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <div className="flex">
                <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p>{error}</p>
                  <button 
                    onClick={fetchStats}
                    className="mt-2 text-sm underline hover:no-underline"
                  >
                    Coba lagi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat) => (
                <div
                  key={stat.name}
                  className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 p-3 ${stat.color} rounded-lg`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3">
                    <a
                      href={stat.href}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Kelola →
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow-lg rounded-xl">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Aksi Cepat</h3>
                <p className="text-sm text-gray-600">Kelola konten portfolio Anda dengan mudah</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                    + Tambah Project
                  </button>
                  <button className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                    ✍️ Tulis Artikel
                  </button>
                  <button className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                    👤 Update Profile
                  </button>
                  <button className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                    ⚙️ Pengaturan
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}