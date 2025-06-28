import React from 'react';
import { Card } from '@/components/ui/Card';
import { GraduationCap, Calendar } from 'lucide-react';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  description: string;
  gpa?: string;
}

interface EducationProps {
  education: Education[];
}

export const Education: React.FC<EducationProps> = ({ education }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Education</h2>
          <p className="text-xl text-gray-600">My academic journey</p>
        </div>

        <div className="space-y-8">
          {education.map((edu) => (
            <Card key={edu.id} className="relative">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span>
                        {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                      </span>
                    </div>
                  </div>
                  <p className="text-lg text-blue-600 font-medium mb-3">
                    {edu.institution}
                  </p>
                  {edu.gpa && (
                    <p className="text-gray-600 mb-3">GPA: {edu.gpa}</p>
                  )}
                  <p className="text-gray-700">{edu.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};