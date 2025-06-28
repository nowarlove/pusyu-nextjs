import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Calendar, MapPin } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
}

interface ActivityProps {
  activities: Activity[];
}

export const Activity: React.FC<ActivityProps> = ({ activities }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Activities</h2>
          <p className="text-xl text-gray-600">Events, workshops, and activities I've participated in</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <Card key={activity.id} className="group hover:scale-105 transition-transform">
              {activity.image && (
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {activity.title}
              </h3>
              
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar size={16} />
                <span className="text-sm">{formatDate(activity.date)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin size={16} />
                <span className="text-sm">{activity.location}</span>
              </div>
              
              <p className="text-gray-700 text-sm">
                {activity.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
