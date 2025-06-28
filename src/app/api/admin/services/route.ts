import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
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
    const { name, description, price, unit, features, active } = body;

    // Convert features array to JSON string for storage
    const featuresString = Array.isArray(features) ? JSON.stringify(features) : features;

    const service = await prisma.service.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        unit: unit || 'hour',
        features: featuresString || null,
        active: active !== undefined ? active : true
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}