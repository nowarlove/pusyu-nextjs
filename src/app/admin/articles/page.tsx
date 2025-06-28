"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import ImageUpload from '@/components/admin/ImageUpload';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Filter,
  Calendar,
  Clock,
  Tag
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Validation schema
const articleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  image: z.string().optional(),
  published: z.boolean().default(false), // Make required with default
  tags: z.string().optional(), // Will be converted to array
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  published: boolean;
  tags?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, published, draft

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      published: false
    }
  });

  const watchTitle = watch('title');

  // Generate slug from title
  useEffect(() => {
    if (watchTitle && !editingArticle) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  }, [watchTitle, editingArticle, setValue]);

  // Fetch articles
  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/admin/articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Handle form submission
  const onSubmit = async (data: ArticleFormData) => {
    try {
      const articleData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : []
      };

      const url = editingArticle 
        ? `/api/admin/articles/${editingArticle.id}`
        : '/api/admin/articles';
      
      const method = editingArticle ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData)
      });

      if (response.ok) {
        await fetchArticles();
        handleCloseModal();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchArticles();
      } else {
        alert('Error deleting article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article');
    }
  };

  // Handle edit
  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    reset({
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt || '',
      image: article.image || '',
      published: article.published,
      tags: Array.isArray(article.tags) 
        ? article.tags.join(', ') 
        : article.tags || ''
    });
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
    reset();
  };

  // Toggle publish status
  const togglePublished = async (article: Article) => {
    try {
      const response = await fetch(`/api/admin/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...article, published: !article.published })
      });

      if (response.ok) {
        await fetchArticles();
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && article.published) ||
                         (filterStatus === 'draft' && !article.published);

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const parseTags = (tags: string | string[]) => {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') {
      try {
        return JSON.parse(tags);
      } catch {
        return tags.split(',').map(tag => tag.trim());
      }
    }
    return [];
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading articles...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
            <p className="text-gray-600">Manage your blog articles</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus size={20} />
            Add Article
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Articles</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Total: {filteredArticles.length} articles
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="flex flex-col">
              {/* Article Image */}
              {article.image && (
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={article.published ? "success" : "secondary"}>
                    {article.published ? "Published" : "Draft"}
                  </Badge>
                  <button
                    onClick={() => togglePublished(article)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    {article.published ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>

                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {article.title}
                </h3>

                {article.excerpt && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}

                {/* Tags */}
                {article.tags && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {parseTags(article.tags).slice(0, 3).map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Meta */}
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Calendar size={12} className="mr-1" />
                  <span>{formatDate(article.createdAt)}</span>
                  {article.updatedAt !== article.createdAt && (
                    <>
                      <span className="mx-2">•</span>
                      <Clock size={12} className="mr-1" />
                      <span>Updated {formatDate(article.updatedAt)}</span>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(article)}
                    className="flex-1 gap-1"
                  >
                    <Edit size={14} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(article.id)}
                    className="text-red-600 hover:bg-red-50 gap-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Tag size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter' 
                : 'Get started by creating your first article'
              }
            </p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingArticle ? 'Edit Article' : 'Add New Article'}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        {...register('title')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                      )}
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug *
                      </label>
                      <input
                        {...register('slug')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.slug && (
                        <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      {...register('excerpt')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of the article..."
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <textarea
                      {...register('content')}
                      rows={12}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Write your article content here..."
                    />
                    {errors.content && (
                      <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image
                      </label>
                      <ImageUpload
                        value={watch('image') || ''}
                        onChange={(url) => setValue('image', url)}
                        placeholder="Upload article image"
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <input
                        {...register('tags')}
                        placeholder="React, Next.js, JavaScript (comma separated)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-gray-500 text-sm mt-1">Separate tags with commas</p>
                    </div>
                  </div>

                  {/* Published */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('published')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Publish immediately
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? 'Saving...' : editingArticle ? 'Update Article' : 'Create Article'}
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