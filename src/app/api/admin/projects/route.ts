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

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formattedProjects = projects.map(project => ({
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : [],
    }));
    
    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, image, technologies, githubUrl, liveUrl, category, featured } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description: description || null,
        image: image || null,
        technologies: technologies ? JSON.stringify(technologies) : null,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        category: category || null,
        featured: Boolean(featured),
      },
    });

    return NextResponse.json({
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : [],
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}