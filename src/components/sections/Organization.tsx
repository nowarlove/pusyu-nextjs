import React from 'react';
import { Card } from '@/components/ui/Card';
import { Users, Calendar } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  position: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
}

interface OrganizationProps {
  organizations: Organization[];
}

export const Organization: React.FC<OrganizationProps> = ({ organizations }) => {
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Organizations</h2>
          <p className="text-xl text-gray-600">My involvement in communities and organizations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {organizations.map((org) => (
            <Card key={org.id} className="h-full">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {org.position}
                  </h3>
                  <p className="text-lg text-purple-600 font-medium mb-3">
                    {org.name}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Calendar size={16} />
                    <span>
                      {formatDate(org.startDate)} - {org.current ? 'Present' : formatDate(org.endDate!)}
                    </span>
                  </div>
                  <p className="text-gray-700">{org.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};