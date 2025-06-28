import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { company, position, location, startDate, endDate, current, description, skills } = body;

    const experience = await prisma.experience.update({
      where: { id: params.id },
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
    console.error('Error updating experience:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.experience.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}