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

    const profile = await prisma.profile.findFirst();
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
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
    const { name, title, description, email, phone, location, website, photo, resume } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Check if profile exists
    const existingProfile = await prisma.profile.findFirst();
    
    let profile;
    if (existingProfile) {
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: {
          name,
          title: title || null,
          description: description || null,
          email: email || null,
          phone: phone || null,
          location: location || null,
          website: website || null,
          photo: photo || null,
          resume: resume || null,
        },
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          name,
          title: title || null,
          description: description || null,
          email: email || null,
          phone: phone || null,
          location: location || null,
          website: website || null,
          photo: photo || null,
          resume: resume || null,
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}