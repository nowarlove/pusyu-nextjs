import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalProjects,
      totalArticles,
      totalContacts,
      totalSkills,
      totalExperiences,
      totalEducation,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.article.count(),
      prisma.contact.count(),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.education.count(),
    ]);

    return NextResponse.json({
      totalProjects,
      totalArticles,
      totalContacts,
      totalSkills,
      totalExperiences,
      totalEducation,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}