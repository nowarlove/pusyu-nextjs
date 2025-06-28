import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Clock, Calendar } from 'lucide-react';

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

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
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
    <Card className="group hover:scale-105 transition-all duration-300 h-full flex flex-col">
      <Link href={`/articles/${article.slug}`} className="block">
        {/* Article Image */}
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={article.image || '/placeholder-article.jpg'}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Article Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Article Excerpt */}
        {article.excerpt && (
          <p className="text-gray-700 mb-4 text-sm line-clamp-3 flex-grow">
            {article.excerpt}
          </p>
        )}
      </Link>

      {/* Article Meta */}
      <div className="mt-auto">
        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{readTime} min</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
