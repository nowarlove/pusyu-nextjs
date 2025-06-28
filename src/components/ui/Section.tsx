import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'gradient';
  padding?: 'sm' | 'md' | 'lg';
}

export const Section: React.FC<SectionProps> = ({ 
  children, 
  className,
  background = 'white',
  padding = 'lg'
}) => {
  const backgrounds = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-100'
  };

  const paddings = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20'
  };

  return (
    <section className={cn(backgrounds[background], paddings[padding], className)}>
      <div className="container mx-auto px-4 max-w-6xl">
        {children}
      </div>
    </section>
  );
};