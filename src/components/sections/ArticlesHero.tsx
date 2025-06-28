import React from 'react';
import { Section } from '@/components/ui/Section';
import { BookOpen, Users, TrendingUp } from 'lucide-react';

export const ArticlesHero: React.FC = () => {
  const stats = [
    { icon: BookOpen, label: 'Articles', value: '50+' },
    { icon: Users, label: 'Readers', value: '10K+' },
    { icon: TrendingUp, label: 'Monthly Views', value: '25K+' }
  ];

  return (
    <Section background="gradient" className="pt-20">
      <div className="text-center">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            My <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Sharing insights, tutorials, and experiences about web development, 
            programming, and technology. Join me on this journey of continuous learning.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full shadow-lg mb-3">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};