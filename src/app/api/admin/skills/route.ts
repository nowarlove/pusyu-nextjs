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

    const skills = await prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
    
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
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
    const { name, category, level, icon } = body;

    if (!name || !category || !level) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        level: parseInt(level),
        icon: icon || null,
      },
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}