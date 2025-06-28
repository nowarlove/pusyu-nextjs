import React from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  ExternalLink, 
  Facebook,
  Youtube,
  Globe,
  Mail,
  MessageCircle
} from 'lucide-react';

interface SocialMediaItem {
  id: string;
  platform: string;
  username: string;
  url: string;
  active: boolean;
  icon?: string;
  order?: number;
}

interface SocialMediaProps {
  socialMedia: SocialMediaItem[];
}

export const SocialMedia: React.FC<SocialMediaProps> = ({ socialMedia }) => {
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return Github;
      case 'linkedin':
        return Linkedin;
      case 'twitter':
      case 'x':
        return Twitter;
      case 'instagram':
        return Instagram;
      case 'facebook':
        return Facebook;
      case 'youtube':
        return Youtube;
      case 'website':
      case 'portfolio':
        return Globe;
      case 'email':
        return Mail;
      case 'whatsapp':
      case 'telegram':
        return MessageCircle;
      default:
        return ExternalLink;
    }
  };

  const getSocialColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return 'text-gray-700 bg-gray-100 hover:bg-gray-700 hover:text-white border-gray-200 hover:border-gray-700';
      case 'linkedin':
        return 'text-blue-700 bg-blue-100 hover:bg-blue-700 hover:text-white border-blue-200 hover:border-blue-700';
      case 'twitter':
      case 'x':
        return 'text-sky-700 bg-sky-100 hover:bg-sky-700 hover:text-white border-sky-200 hover:border-sky-700';
      case 'instagram':
        return 'text-pink-700 bg-pink-100 hover:bg-pink-700 hover:text-white border-pink-200 hover:border-pink-700';
      case 'facebook':
        return 'text-blue-800 bg-blue-100 hover:bg-blue-800 hover:text-white border-blue-200 hover:border-blue-800';
      case 'youtube':
        return 'text-red-700 bg-red-100 hover:bg-red-700 hover:text-white border-red-200 hover:border-red-700';
      case 'website':
      case 'portfolio':
        return 'text-green-700 bg-green-100 hover:bg-green-700 hover:text-white border-green-200 hover:border-green-700';
      case 'email':
        return 'text-purple-700 bg-purple-100 hover:bg-purple-700 hover:text-white border-purple-200 hover:border-purple-700';
      case 'whatsapp':
        return 'text-green-600 bg-green-100 hover:bg-green-600 hover:text-white border-green-200 hover:border-green-600';
      case 'telegram':
        return 'text-blue-600 bg-blue-100 hover:bg-blue-600 hover:text-white border-blue-200 hover:border-blue-600';
      default:
        return 'text-gray-700 bg-gray-100 hover:bg-gray-700 hover:text-white border-gray-200 hover:border-gray-700';
    }
  };

  const getPlatformDescription = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return 'Code repositories and projects';
      case 'linkedin':
        return 'Professional network';
      case 'twitter':
      case 'x':
        return 'Latest updates and thoughts';
      case 'instagram':
        return 'Behind the scenes content';
      case 'facebook':
        return 'Community and updates';
      case 'youtube':
        return 'Video tutorials and content';
      case 'website':
      case 'portfolio':
        return 'Personal website';
      case 'email':
        return 'Direct contact';
      case 'whatsapp':
        return 'Quick messaging';
      case 'telegram':
        return 'Instant messaging';
      default:
        return 'Connect with me';
    }
  };

  // Filter and sort active social media
  const activeSocialMedia = socialMedia
    .filter(social => social.active)
    .sort((a, b) => (a.order || 999) - (b.order || 999));

  if (activeSocialMedia.length === 0) {
    return (
      <Section background="white">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect With Me</h2>
          <p className="text-gray-600">Social media links will be available soon.</p>
        </div>
      </Section>
    );
  }

  return (
    <Section background="white">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect With Me</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Follow my journey, see my latest work, and connect with me on various platforms
        </p>
      </div>

      {/* Main Social Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {activeSocialMedia.map((social) => {
          const IconComponent = getSocialIcon(social.platform);
          const colorClasses = getSocialColor(social.platform);
          
          return (
            <Card key={social.id} className={`group hover:scale-105 transition-all duration-300 border-2 ${colorClasses.split(' ').slice(-2).join(' ')}`}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center p-6"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-300 ${colorClasses}`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {social.platform}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3">
                  {social.username}
                </p>

                <p className="text-gray-500 text-xs mb-4">
                  {getPlatformDescription(social.platform)}
                </p>
                
                <div className="flex items-center justify-center gap-2 text-blue-600 group-hover:text-blue-700 transition-colors">
                  <span className="text-sm font-medium">
                    {social.platform.toLowerCase() === 'email' ? 'Send Email' : 
                     social.platform.toLowerCase().includes('whatsapp') || social.platform.toLowerCase().includes('telegram') ? 'Message' :
                     'Follow'}
                  </span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            </Card>
          );
        })}
      </div>

      {/* Featured Social Links */}
      {activeSocialMedia.length > 0 && (
        <div className="mt-12 text-center">
          <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Stay Connected
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Follow me for the latest updates on web development trends, project showcases, 
              tutorials, and behind-the-scenes content from my development journey.
            </p>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              {activeSocialMedia.slice(0, 3).map((social) => {
                const IconComponent = getSocialIcon(social.platform);
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {social.platform.toLowerCase() === 'email' ? 'Email Me' : 
                       `Follow on ${social.platform}`}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Contact Preference */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
          <MessageCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-700 font-medium">
            Prefer direct contact? Use the contact form above for business inquiries
          </span>
        </div>
      </div>
    </Section>
  );
};