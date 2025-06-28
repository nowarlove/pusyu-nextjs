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

    const organizations = await prisma.organization.findMany({
      orderBy: { startDate: 'desc' },
    });
    
    return NextResponse.json(organizations);
  } catch (error) {
    console.error('Error fetching organizations:', error);
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
    const { name, position, startDate, endDate, current, description } = body;

    if (!name || !position || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        position,
        startDate: new Date(startDate),
        endDate: current ? null : (endDate ? new Date(endDate) : null),
        current: Boolean(current),
        description: description || null,
      },
    });

    return NextResponse.json(organization);
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}