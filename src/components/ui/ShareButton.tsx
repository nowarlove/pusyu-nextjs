"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  excerpt: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ title, excerpt }) => {
  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: excerpt || '',
          url: url,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log('Sharing cancelled or failed');
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link copied to clipboard!');
      }
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      className="gap-2"
    >
      <Share2 size={20} />
      Share Article
    </Button>
  );
};