import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizes[size]}`}></div>
  );
};

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={`skeleton ${className}`}></div>;
};

export const LoadingCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
      <div className="flex space-x-2">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
};