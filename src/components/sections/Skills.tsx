import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

interface SkillsProps {
  skills: Skill[];
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const getLevelColor = (level: number) => {
    if (level >= 4) return 'success';
    if (level >= 3) return 'primary';
    if (level >= 2) return 'warning';
    return 'secondary';
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Skills & Expertise</h2>
          <p className="text-xl text-gray-600">Technologies and tools I work with</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <Card key={category} className="h-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 capitalize">
                {category}
              </h3>
              <div className="space-y-3">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between">
                    <span className="text-gray-700">{skill.name}</span>
                    <Badge variant={getLevelColor(skill.level) as any}>
                      Level {skill.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
