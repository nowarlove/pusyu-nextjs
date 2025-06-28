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

    const activities = await prisma.activity.findMany({
      orderBy: { date: 'desc' },
    });
    
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
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
    const { title, description, date, location, image } = body;

    if (!title || !description || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        description,
        date: new Date(date),
        location: location || null,
        image: image || null,
      },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}