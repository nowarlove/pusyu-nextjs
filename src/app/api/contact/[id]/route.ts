import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET single contact
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const contact = await prisma.contact.findUnique({
      where: {
        id: params.id
      }
    });

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Error fetching contact:', error);
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH update contact (mark as read/unread)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { read } = body;

    if (typeof read !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid read status' },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.update({
      where: {
        id: params.id
      },
      data: {
        read
      }
    });

    return NextResponse.json({
      success: true,
      message: `Contact marked as ${read ? 'read' : 'unread'}`,
      data: contact
    });

  } catch (error) {
    console.error('Error updating contact:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.contact.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting contact:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}