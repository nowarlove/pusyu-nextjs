import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import { BackToTop } from '@/components/ui/BackToTop';
import { Section } from '@/components/ui/Section';
import { ShareButton } from '@/components/ui/ShareButton';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  BookOpen,
  Tag
} from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{ slug: string }>; // Changed to Promise for Next.js 15
}

async function getArticle(slug: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

async function getRelatedArticles(currentSlug: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/articles?limit=3`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    // Filter out current article and return first 3
    return data.articles
      .filter((article: any) => article.slug !== currentSlug)
      .slice(0, 3);
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function estimateReadTime(content: string) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  // Await params before using its properties
  const { slug } = await params;
  const article = await getArticle(slug);
  
  if (!article) {
    notFound();
  }

  const readTime = estimateReadTime(article.content);
  const relatedArticles = await getRelatedArticles(article.slug);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Article Header */}
        <Section background="white" className="pt-20">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link 
              href="/articles" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 gap-2"
            >
              <ArrowLeft size={20} />
              Back to Articles
            </Link>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{readTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen size={16} />
                <span>Article</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    <Tag size={12} />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Featured Image */}
            {article.image && (
              <div className="relative w-full h-64 md:h-96 mb-12 rounded-lg overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </Section>

        {/* Article Content */}
        <Section background="white">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {/* Convert line breaks to paragraphs */}
              {article.content.split('\n\n').map((paragraph: string, index: number) => (
                paragraph.trim() && (
                  <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                )
              ))}
            </div>

            {/* Share Button */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <ShareButton 
                title={article.title}
                excerpt={article.excerpt || ''}
              />
            </div>
          </div>
        </Section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <Section background="gray">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.map((relatedArticle: any) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/articles/${relatedArticle.slug}`}
                    className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    {relatedArticle.image && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedArticle.image}
                          alt={relatedArticle.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      
                      {relatedArticle.excerpt && (
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {relatedArticle.excerpt}
                        </p>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        {formatDate(relatedArticle.createdAt)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Section>
        )}
      </main>
      
      <Footer socialMedia={[]} />
      <BackToTop />
    </div>
  );
}