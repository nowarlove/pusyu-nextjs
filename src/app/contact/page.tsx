import React from 'react';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { SocialMedia } from '@/components/contact/SocialMedia';
import { ServiceFees } from '@/components/contact/ServiceFees';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BackToTop } from '@/components/ui/BackToTop';

// Fetch data from API
async function getContactData() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    const [portfolioRes, socialRes, servicesRes] = await Promise.all([
      fetch(`${baseUrl}/api/portfolio`, { 
        cache: 'no-store' 
      }),
      fetch(`${baseUrl}/api/admin/social-media`, { 
        cache: 'no-store' 
      }),
      fetch(`${baseUrl}/api/admin/services`, { 
        cache: 'no-store' 
      })
    ]);

    const [portfolioData, socialMedia, services] = await Promise.all([
      portfolioRes.json(),
      socialRes.json(),
      servicesRes.json()
    ]);

    return {
      profile: portfolioData.profile || getDefaultProfile(),
      socialMedia: socialMedia.data || portfolioData.socialMedia || getDefaultSocialMedia(),
      services: services.data || getDefaultServices()
    };
  } catch (error) {
    console.error('Error fetching contact data:', error);
    // Return fallback data
    return {
      profile: getDefaultProfile(),
      socialMedia: getDefaultSocialMedia(),
      services: getDefaultServices()
    };
  }
}

// Fallback data jika API gagal
function getDefaultProfile() {
  return {
    name: "Putri Suci Renita",
    title: "Full Stack Developer",
    email: "putri@gmail.com",
    phone: "+62 812-3456-7890",
    location: "Kepulauan Riau, Indonesia",
    description: "Experienced full stack developer with a passion for building scalable web applications. Proficient in modern JavaScript frameworks and backend technologies.",
  };
}

function getDefaultSocialMedia() {
  return [
    {
      id: "1",
      platform: "GitHub",
      username: "Pusyu",
      url: "https://github.com/yourusername",
      active: true
    },
    {
      id: "2", 
      platform: "LinkedIn",
      username: "Pusyu",
      url: "linkedin.com/in/putrisucirenita",
      active: true
    },
    {
      id: "3",
      platform: "Twitter", 
      username: "@pusyu",
      url: "https://twitter.com/yourusername",
      active: true
    },
    {
      id: "4",
      platform: "Instagram",
      username: "@lastyujeon",
      url: "https://instagram.com/lastyujeon", 
      active: true
    }
  ];
}

function getDefaultServices() {
  return [
    {
      id: "1",
      name: "Frontend Development",
      description: "React, Next.js, Vue.js applications with modern UI/UX",
      price: 13,
      unit: "hour",
      features: ["Responsive Design", "Modern Frameworks", "Performance Optimization", "Cross-browser Compatibility"],
      active: true
    },
    {
      id: "2", 
      name: "Backend Development",
      description: "Node.js, Express, API development and database design",
      price: 60,
      unit: "hour",
      features: ["RESTful APIs", "Database Design", "Authentication", "Performance Optimization"],
      active: true
    },
    {
      id: "3",
      name: "Full Stack Development",
      description: "Complete web application development from concept to deployment",
      price: 80,
      unit: "hour",
      features: ["End-to-end Development", "Database Design", "Deployment & DevOps", "Maintenance & Support"],
      active: true
    },
    {
      id: "4",
      name: "Consulting & Code Review",
      description: "Technical consultation and code quality improvements",
      price: 100,
      unit: "hour",
      features: ["Architecture Review", "Code Quality Analysis", "Performance Audit", "Best Practices Guidance"],
      active: true
    }
  ];
}

export default async function ContactPage() {
  const { profile, socialMedia, services } = await getContactData();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <ContactHero profile={profile} />
        <div id="contact-form">
          <ContactForm />
        </div>
        <ServiceFees services={services} />
        <SocialMedia socialMedia={socialMedia} />
        <ContactInfo profile={profile} />
      </main>

      <Footer socialMedia={socialMedia} />
      <BackToTop />
    </div>
  );
}