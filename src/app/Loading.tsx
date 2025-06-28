import { LoadingFallback } from '@/components/sections/LoadingFallback';

export default function Loading() {
  return <LoadingFallback />;
}

// Contoh cara menambahkan revalidation untuk ISR (Incremental Static Regeneration)
// src/app/page.tsx dengan ISR
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroImproved as Hero } from '@/components/sections/Hero';
import { Skills } from '@/components/sections/Skills';
import { Education } from '@/components/sections/Education';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Organization } from '@/components/sections/Organization';
import { Activity } from '@/components/sections/Activity';
import { Stats } from '@/components/sections/Stats';
import { BackToTop } from '@/components/ui/BackToTop';

// Revalidate setiap 60 detik
export const revalidate = 60;

const fallbackData = {
  profile: {
    name: "Portfolio Owner",
    title: "Full Stack Developer",
    description: "Passionate developer with expertise in modern web technologies. Welcome to my portfolio!",
    photo: "/placeholder-avatar.jpg",
    location: "Jakarta, Indonesia",
    email: "contact@example.com",
    resume: "/resume.pdf"
  },
  skills: [
    { id: '1', name: 'React.js', category: 'Frontend', level: 5 },
    { id: '2', name: 'Next.js', category: 'Frontend', level: 4 },
    { id: '3', name: 'TypeScript', category: 'Frontend', level: 4 },
    { id: '4', name: 'Node.js', category: 'Backend', level: 4 },
    { id: '5', name: 'MySQL', category: 'Database', level: 4 },
  ],
  education: [],
  experiences: [],
  projects: [],
  organizations: [],
  activities: [],
  socialMedia: [
    {
      id: '1',
      platform: 'GitHub',
      username: 'github',
      url: 'https://github.com',
      active: true
    }
  ]
};

async function getPortfolioData() {
  try {
    // Use absolute URL untuk server-side fetching
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/portfolio`, {
      next: { revalidate: 60 }, // Cache selama 60 detik
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch portfolio data');
    }
    
    const data = await response.json();
    
    return {
      profile: data.profile || fallbackData.profile,
      skills: data.skills.length > 0 ? data.skills : fallbackData.skills,
      education: data.education,
      experiences: data.experiences,
      projects: data.projects,
      organizations: data.organizations,
      activities: data.activities,
      socialMedia: data.socialMedia.length > 0 ? data.socialMedia : fallbackData.socialMedia,
    };
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return fallbackData;
  }
}

export default async function HomePage() {
  const portfolioData = await getPortfolioData();

  const stats = {
    projects: portfolioData.projects.length,
    experience: portfolioData.experiences.length,
    technologies: portfolioData.skills.length,
    clients: Math.floor(portfolioData.projects.length * 1.5),
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <Hero profile={portfolioData.profile} />
        <Stats stats={stats} />
        <Skills skills={portfolioData.skills} />
        {portfolioData.education.length > 0 && (
          <Education education={portfolioData.education} />
        )}
        {portfolioData.experiences.length > 0 && (
          <Experience experiences={portfolioData.experiences} />
        )}
        {portfolioData.projects.length > 0 && (
          <Projects projects={portfolioData.projects} />
        )}
        {portfolioData.organizations.length > 0 && (
          <Organization organizations={portfolioData.organizations} />
        )}
        {portfolioData.activities.length > 0 && (
          <Activity activities={portfolioData.activities} />
        )}
      </main>
      
      <Footer socialMedia={portfolioData.socialMedia} />
      <BackToTop />
    </div>
  );
}