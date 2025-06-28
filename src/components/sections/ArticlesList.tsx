"use client";

import React, { useState } from 'react';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { FeaturedArticle } from '@/components/ui/FeaturedArticle';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Search, Filter } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ArticlesListProps {
  articles: Article[];
}

export const ArticlesList: React.FC<ArticlesListProps> = ({ articles }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showCount, setShowCount] = useState(6);

  // Since we don't have featured flag in database, let's take first 2 as featured
  const featuredArticles = articles.slice(0, 2);
  const regularArticles = articles.slice(2);

  const filteredArticles = regularArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const visibleArticles = sortedArticles.slice(0, showCount);

  return (
    <Section background="gray">
      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredArticles.map((article) => (
              <FeaturedArticle key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {visibleArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* No Results */}
      {filteredArticles.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      )}

      {/* No Articles */}
      {articles.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles yet</h3>
          <p className="text-gray-600">Check back later for new content!</p>
        </div>
      )}

      {/* Load More */}
      {visibleArticles.length < filteredArticles.length && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowCount(prev => prev + 6)}
            className="px-8"
          >
            Load More Articles
          </Button>
        </div>
      )}
    </Section>
  );
};