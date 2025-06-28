import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';

interface SocialMedia {
  id: string;
  platform: string;
  username: string;
  url: string;
  icon?: string;
  active: boolean;
}

interface FooterProps {
  socialMedia: SocialMedia[];
}

export const Footer: React.FC<FooterProps> = ({ socialMedia }) => {
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github size={20} />;
      case 'linkedin':
        return <Linkedin size={20} />;
      case 'twitter':
        return <Twitter size={20} />;
      default:
        return <Mail size={20} />;
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Putri Suci Renita</h3>
            <p className="text-gray-400">
              Building digital experiences with passion and precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/articles" className="block text-gray-400 hover:text-white transition-colors">
                Articles
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              {socialMedia.filter(social => social.active).map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center gap-2">
            Made with <Heart size={16} className="text-red-500" /> using Next.js & Tailwind CSS
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};