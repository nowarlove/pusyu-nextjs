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
    const { institution, degree, field, startDate, endDate, description, gpa } = body;

    const education = await prisma.education.update({
      where: { id: params.id },
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
    console.error('Error updating education:', error);
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

    await prisma.education.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Error deleting education:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}