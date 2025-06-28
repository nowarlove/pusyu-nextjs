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

    const education = await prisma.education.findMany({
      orderBy: { startDate: 'desc' },
    });
    
    return NextResponse.json(education);
  } catch (error) {
    console.error('Error fetching education:', error);
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
    const { institution, degree, field, startDate, endDate, description, gpa } = body;

    if (!institution || !degree || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const education = await prisma.education.create({
      data: {
        institution,
        degree,
        field: field || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description: description || null,
        gpa: gpa || null,
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error('Error creating education:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}