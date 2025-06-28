import React from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  MapPin, 
  Clock, 
  Globe, 
  Users, 
  Award, 
  Coffee,
  Zap,
  HeartHandshake
} from 'lucide-react';

interface ContactInfoProps {
  profile: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    description: string;
  };
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ profile }) => {
  const workingHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'By appointment only' }
  ];

  const quickFacts = [
    {
      icon: Users,
      label: 'Clients Served',
      value: '50+',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Award,
      label: 'Projects Completed',
      value: '100+',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Coffee,
      label: 'Cups of Coffee',
      value: '∞',
      color: 'text-amber-600 bg-amber-100'
    },
    {
      icon: Zap,
      label: 'Response Time',
      value: '< 24h',
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const workingPrinciples = [
    {
      icon: HeartHandshake,
      title: 'Client-First Approach',
      description: 'Your success is my success. I prioritize understanding your needs and delivering solutions that exceed expectations.'
    },
    {
      icon: Zap,
      title: 'Agile Development',
      description: 'Fast iterations, regular communication, and flexible adaptation to changing requirements throughout the project.'
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Rigorous testing, clean code practices, and attention to detail ensure robust and maintainable solutions.'
    }
  ];

  return (
    <Section background="gray">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Details */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-gray-600 text-sm">{profile.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-gray-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Timezone</p>
                  <p className="text-gray-600 text-sm">GMT+7 (Jakarta Time)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Availability</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    {workingHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{schedule.day}</span>
                        <span>{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Badge variant="success" className="mb-3">
                Currently Available
              </Badge>
              <p className="text-sm text-gray-600">
                I'm currently accepting new projects and would love to hear about yours!
              </p>
            </div>
          </Card>
        </div>

        {/* Working Principles & Quick Facts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Facts */}
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Facts</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickFacts.map((fact, index) => (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 ${fact.color}`}>
                    <fact.icon className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{fact.value}</div>
                  <div className="text-sm text-gray-600">{fact.label}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Working Principles */}
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">How I Work</h3>
            <div className="space-y-6">
              {workingPrinciples.map((principle, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <principle.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {principle.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* FAQ Preview */}
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Do you work with international clients?
                </h4>
                <p className="text-gray-600 text-sm">
                  Yes! I work with clients worldwide and am comfortable with different timezones and communication preferences.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  What's your typical project timeline?
                </h4>
                <p className="text-gray-600 text-sm">
                  Most projects take 2-8 weeks depending on complexity. I'll provide a detailed timeline during our initial consultation.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Do you provide ongoing maintenance?
                </h4>
                <p className="text-gray-600 text-sm">
                  Yes, I offer maintenance packages to keep your website secure, updated, and performing optimally.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
};