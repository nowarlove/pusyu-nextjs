import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArticlesHero } from '@/components/sections/ArticlesHero';
import { ArticlesList } from '@/components/sections/ArticlesList';
import { ArticleCategories } from '@/components/sections/ArticleCategories';
import { BackToTop } from '@/components/ui/BackToTop';

async function getArticlesData() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    // Get articles
    const articlesResponse = await fetch(`${baseUrl}/api/articles?limit=20`, {
      cache: 'no-store' // Always get fresh data
    });
    
    if (!articlesResponse.ok) {
      throw new Error('Failed to fetch articles');
    }
    
    const articlesData = await articlesResponse.json();

    // Get social media for footer
    let socialMedia = [];
    try {
      const socialResponse = await fetch(`${baseUrl}/api/portfolio`, {
        cache: 'no-store'
      });
      
      if (socialResponse.ok) {
        const portfolioData = await socialResponse.json();
        socialMedia = portfolioData.socialMedia || [];
      }
    } catch (error) {
      console.log('Could not fetch social media data');
    }

    // Process categories from articles
    const categories = generateCategoriesFromArticles(articlesData.articles || []);

    return {
      articles: articlesData.articles || [],
      categories,
      socialMedia
    };
  } catch (error) {
    console.error('Error fetching articles data:', error);
    
    // Return fallback data if API fails
    return {
      articles: getFallbackArticles(),
      categories: getFallbackCategories(),
      socialMedia: []
    };
  }
}

function generateCategoriesFromArticles(articles: any[]) {
  const categoryMap = new Map();
  
  articles.forEach(article => {
    if (article.tags && Array.isArray(article.tags)) {
      article.tags.forEach((tag: string) => {
        if (categoryMap.has(tag)) {
          categoryMap.set(tag, categoryMap.get(tag) + 1);
        } else {
          categoryMap.set(tag, 1);
        }
      });
    }
  });

  // Convert to category format and limit to top categories
  const categories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1]) // Sort by count descending
    .slice(0, 8) // Take top 8 categories
    .map(([name, count], index) => ({
      id: `cat-${index}`,
      name,
      count,
      color: getColorForCategory(index)
    }));

  return categories;
}

function getColorForCategory(index: number) {
  const colors = ['blue', 'green', 'purple', 'orange', 'red', 'indigo', 'pink', 'teal'];
  return colors[index % colors.length];
}

// Fallback data when API is not available
function getFallbackArticles() {
  return [
    {
      id: 'sample-1',
      title: 'Getting Started with Next.js 14: A Complete Guide',
      slug: 'getting-started-nextjs-14',
      excerpt: 'Learn how to build modern web applications with Next.js 14, including the new App Router, Server Components, and more.',
      image: '/placeholder-article.jpg',
      tags: ['Next.js', 'React', 'JavaScript', 'Tutorial'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sample-2',
      title: 'Building Scalable APIs with Node.js and Express',
      slug: 'scalable-apis-nodejs-express',
      excerpt: 'Best practices for creating robust and scalable REST APIs using Node.js, Express, and modern development patterns.',
      image: '/placeholder-article.jpg',
      tags: ['Node.js', 'Express', 'API', 'Backend'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

function getFallbackCategories() {
  return [
    { id: '1', name: 'Web Development', count: 12, color: 'blue' },
    { id: '2', name: 'Backend Development', count: 8, color: 'green' },
    { id: '3', name: 'Frontend Development', count: 15, color: 'purple' },
    { id: '4', name: 'Programming', count: 6, color: 'orange' }
  ];
}

export default async function ArticlesPage() {
  const { articles, categories, socialMedia } = await getArticlesData();

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <ArticlesHero />
        {categories.length > 0 && (
          <ArticleCategories categories={categories} />
        )}
        <ArticlesList articles={articles} />
      </main>
      
      <Footer socialMedia={socialMedia} />
      <BackToTop />
    </div>
  );
}