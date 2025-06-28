import React from 'react';
import { Section } from '@/components/ui/Section';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

interface ContactHeroProps {
  profile: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    description: string;
  };
}

export const ContactHero: React.FC<ContactHeroProps> = ({ profile }) => {
  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: profile.phone,
      href: `tel:${profile.phone}`,
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: profile.location,
      href: '#',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: MessageCircle,
      label: 'Let\'s Chat',
      value: 'Available for projects',
      href: '#contact-form',
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  return (
    <Section background="gradient" className="pt-20">
      <div className="text-center">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Let's Work <span className="gradient-text">Together</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {profile.description}
          </p>
          
          {/* Contact Methods Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.href}
                className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${method.color} group-hover:scale-110 transition-transform`}>
                  <method.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{method.label}</h3>
                <p className="text-sm text-gray-600">{method.value}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};