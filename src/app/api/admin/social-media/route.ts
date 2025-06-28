import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const socialMedia = await prisma.socialMedia.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Error fetching social media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { platform, username, url, icon, order, active } = body;

    const socialMedia = await prisma.socialMedia.create({
      data: {
        platform,
        username,
        url,
        icon: icon || null,
        order: order || 0,
        active: active !== undefined ? active : true
      }
    });

    return NextResponse.json(socialMedia, { status: 201 });
  } catch (error) {
    console.error('Error creating social media:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}