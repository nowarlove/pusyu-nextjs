import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const socialMedia = await prisma.socialMedia.findUnique({
      where: { id }
    });

    if (!socialMedia) {
      return NextResponse.json({ error: 'Social media not found' }, { status: 404 });
    }

    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Error fetching social media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { platform, username, url, icon, order, active } = body;

    const socialMedia = await prisma.socialMedia.update({
      where: { id },
      data: {
        platform,
        username,
        url,
        icon: icon || null,
        order: order || 0,
        active: active !== undefined ? active : true
      }
    });

    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Error updating social media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.socialMedia.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Social media deleted successfully' });
  } catch (error) {
    console.error('Error deleting social media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}