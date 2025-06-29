"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { Mail, MapPin, ArrowDown } from 'lucide-react';

interface HeroProps {
  profile: {
    name: string;
    title: string;
    description: string;
    photo: string;
    location: string;
    email: string;
    resume?: string;
  };
}

export const HeroImproved: React.FC<HeroProps> = ({ profile }) => {
  const router = useRouter();

  const handleContactMe = () => {
    router.push('/contact');
  };

  const scrollToProjects = () => {
    // Add small delay to ensure page is fully loaded
    setTimeout(() => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        console.log('Projects section not found');
      }
    }, 100);
  };



  return (
    <Section background="gradient" className="min-h-screen flex items-center justify-center pt-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Text Content */}
        <div className="text-center lg:text-left order-2 lg:order-1">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
              Hi, I'm{' '}
              <span className="gradient-text">{profile.name}</span>
            </h1>
            <h2 className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-6">
              {profile.title}
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {profile.description}
            </p>
            
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-8 text-gray-600">
              <MapPin size={18} />
              <span>{profile.location}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button 
                size="lg" 
                className="gap-2 focus-ring"
                onClick={handleContactMe}
              >
                <Mail size={18} />
                Contact Me
              </Button>
            </div>

            <button 
              onClick={scrollToProjects}
              className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors focus-ring rounded-lg p-2"
            >
              <span>Explore my work</span>
              <ArrowDown size={20} className="animate-bounce" />
            </button>
          </div>
        </div>

        {/* Photo */}
        <div className="flex justify-center lg:justify-end order-1 lg:order-2">
          <div className="relative animate-fade-in-up">
            <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl relative">
              <Image
                src={profile.photo || '/placeholder-avatar.jpg'}
                alt={profile.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-blue-200 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-indigo-200 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </Section>
  );
};