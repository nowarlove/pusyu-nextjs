import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const experiences = await prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    });

    const formattedExperiences = experiences.map(exp => ({
      ...exp,
      skills: exp.skills ? JSON.parse(exp.skills) : [],
    }));
    
    return NextResponse.json(formattedExperiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { company, position, location, startDate, endDate, current, description, skills } = body;

    if (!company || !position || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const experience = await prisma.experience.create({
      data: {
        company,
        position,
        location: location || null,
        startDate: new Date(startDate),
        endDate: current ? null : (endDate ? new Date(endDate) : null),
        current: Boolean(current),
        description: description || null,
        skills: skills && skills.length > 0 ? JSON.stringify(skills) : null,
      },
    });

    return NextResponse.json({
      ...experience,
      skills: experience.skills ? JSON.parse(experience.skills) : [],
    });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}