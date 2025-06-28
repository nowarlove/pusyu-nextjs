import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  skills: string[];
}

interface ExperienceProps {
  experiences: Experience[];
}

export const Experience: React.FC<ExperienceProps> = ({ experiences }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Experience</h2>
          <p className="text-xl text-gray-600">My professional journey</p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp) => (
            <Card key={exp.id} className="relative">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {exp.position}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span>
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate!)}
                      </span>
                    </div>
                  </div>
                  <p className="text-lg text-green-600 font-medium mb-2">
                    {exp.company}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin size={16} />
                    <span>{exp.location}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{exp.description}</p>
                  
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
