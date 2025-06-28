import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  subtitle, 
  centered = true 
}) => {
  return (
    <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
      <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
      {subtitle && (
        <p className="text-xl text-gray-600">{subtitle}</p>
      )}
    </div>
  );
};