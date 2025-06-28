import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Clock, Calendar, ArrowRight, Star } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  // Remove author requirement since it's not in database
}

interface FeaturedArticleProps {
  article: Article;
}

export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate estimated read time from excerpt or title
  const estimateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return Math.max(1, readTime); // Minimum 1 minute
  };

  const readTime = estimateReadTime(article.excerpt || article.title);

  return (
    <Card className="group hover:scale-[1.02] transition-all duration-300 overflow-hidden relative">
      {/* Featured Badge */}
      <div className="absolute top-4 left-4 z-10">
        <Badge variant="warning" className="flex items-center gap-1">
          <Star size={12} />
          Featured
        </Badge>
      </div>

      <Link href={`/articles/${article.slug}`} className="block">
        {/* Article Image */}
        <div className="relative h-64 mb-6 overflow-hidden">
          <Image
            src={article.image || '/placeholder-article.jpg'}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-gray-700 mb-6 line-clamp-3">
              {article.excerpt}
            </p>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.slice(0, 4).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>

          {/* Read More Button */}
          <Button variant="outline" className="group-hover:bg-blue-600 group-hover:text-white transition-colors w-full gap-2">
            Read Full Article
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Link>
    </Card>
  );
};