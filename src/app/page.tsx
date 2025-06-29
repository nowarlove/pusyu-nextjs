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

async function getPortfolioData() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/portfolio`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    // Fallback data
    return {
      profile: {
        name: "Portfolio Owner",
        title: "Full Stack Developer", 
        description: "Welcome to my portfolio",
        photo: "/placeholder-avatar.jpg",
        location: "Kepualan Riau, Indonesia",
        email: "contact@example.com"
      },
      skills: [],
      projects: [],
      education: [],
      experiences: [],
      organizations: [],
      activities: [],
      socialMedia: []
    };
  }
}

export default async function HomePage() {
  const data = await getPortfolioData();
  
  console.log('Portfolio data:', data); // Debug log
  
  const stats = {
    projects: data.projects?.length || 0,
    experience: data.experiences?.length || 0, 
    technologies: data.skills?.length || 0,
    clients: Math.floor((data.projects?.length || 0) * 1.5)
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero profile={data.profile} />
        <Stats stats={stats} />
        <Skills skills={data.skills || []} />
        <Education education={data.education || []} />
        <Experience experiences={data.experiences || []} />
        <Projects projects={data.projects || []} />
        <Organization organizations={data.organizations || []} />
        <Activity activities={data.activities || []} />
      </main>
      <Footer socialMedia={data.socialMedia || []} />
      <BackToTop />
    </div>
  );
}