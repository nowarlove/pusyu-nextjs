import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Ambil semua data portfolio secara paralel
    const [
      profile,
      skills,
      education,
      experiences,
      projects,
      organizations,
      activities,
      socialMedia,
    ] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.skill.findMany({
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
      }),
      prisma.education.findMany({
        orderBy: { startDate: 'desc' },
      }),
      prisma.experience.findMany({
        orderBy: { startDate: 'desc' },
      }),
      prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.organization.findMany({
        orderBy: { startDate: 'desc' },
      }),
      prisma.activity.findMany({
        orderBy: { date: 'desc' },
      }),
      prisma.socialMedia.findMany({
        where: { active: true },
        orderBy: { order: 'asc' },
      }),
    ]);

    // Format data untuk frontend
    const portfolioData = {
      profile: profile || {
        name: "Portfolio Owner",
        title: "Developer",
        description: "Welcome to my portfolio",
        photo: "/placeholder-avatar.jpg",
        location: "Indonesia",
        email: "contact@example.com",
        resume: "/resume.pdf"
      },
      skills: skills.map(skill => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        level: skill.level,
        icon: skill.icon,
      })),
      education: education.map(edu => ({
        id: edu.id,
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        startDate: edu.startDate.toISOString().split('T')[0],
        endDate: edu.endDate ? edu.endDate.toISOString().split('T')[0] : null,
        description: edu.description,
        gpa: edu.gpa,
      })),
      experiences: experiences.map(exp => ({
        id: exp.id,
        company: exp.company,
        position: exp.position,
        location: exp.location,
        startDate: exp.startDate.toISOString().split('T')[0],
        endDate: exp.endDate ? exp.endDate.toISOString().split('T')[0] : null,
        current: exp.current,
        description: exp.description,
        skills: exp.skills ? JSON.parse(exp.skills) : [],
      })),
      projects: projects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        image: project.image,
        technologies: project.technologies ? JSON.parse(project.technologies) : [],
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
        category: project.category,
        featured: project.featured,
      })),
      organizations: organizations.map(org => ({
        id: org.id,
        name: org.name,
        position: org.position,
        startDate: org.startDate.toISOString().split('T')[0],
        endDate: org.endDate ? org.endDate.toISOString().split('T')[0] : null,
        current: org.current,
        description: org.description,
      })),
      activities: activities.map(activity => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        date: activity.date.toISOString().split('T')[0],
        location: activity.location,
        image: activity.image,
      })),
      socialMedia: socialMedia.map(social => ({
        id: social.id,
        platform: social.platform,
        username: social.username,
        url: social.url,
        active: social.active,
      })),
    };

    return NextResponse.json(portfolioData);
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}