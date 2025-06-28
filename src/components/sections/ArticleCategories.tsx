"use client";

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Section } from '@/components/ui/Section';

interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
}

interface ArticleCategoriesProps {
  categories: Category[];
}

export const ArticleCategories: React.FC<ArticleCategoriesProps> = ({ categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getColorVariant = (color: string) => {
    const colorMap: Record<string, any> = {
      blue: 'primary',
      green: 'success',
      purple: 'primary',
      orange: 'warning',
      red: 'primary',
      indigo: 'primary'
    };
    return colorMap[color] || 'primary';
  };

  return (
    <Section background="white" padding="sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
        <p className="text-gray-600">Explore articles organized by topics</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {/* All Categories */}
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Articles
        </button>

        {/* Category Badges */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>
    </Section>
  );
};