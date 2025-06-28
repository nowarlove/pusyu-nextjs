"use client";

import React from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';

interface StatsProps {
  stats: {
    projects: number;
    experience: number; // years
    technologies: number;
    clients?: number;
  };
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  const statItems = [
    { label: 'Projects Completed', value: stats.projects, suffix: '+' },
    { label: 'Years Experience', value: stats.experience, suffix: '+' },
    { label: 'Technologies', value: stats.technologies, suffix: '+' },
    ...(stats.clients ? [{ label: 'Happy Clients', value: stats.clients, suffix: '+' }] : [])
  ];

  return (
    <Section background="white" padding="md">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {statItems.map((stat, index) => (
          <Card key={index} className="text-center py-8">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
              {stat.value}{stat.suffix}
            </div>
            <div className="text-gray-600 text-sm md:text-base">
              {stat.label}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
};