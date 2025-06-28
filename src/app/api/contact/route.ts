import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = validationResult.data;

    // Save to database
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message: phone ? `Phone: ${phone}\n\n${message}` : message,
        read: false,
      },
    });

    // Here you could also send email notification to admin
    // await sendEmailNotification(contact);

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
        data: {
          id: contact.id,
          createdAt: contact.createdAt
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating contact:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to send message. Please try again later.'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const read = searchParams.get('read');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (read !== null) {
      where.read = read === 'true';
    }

    // Get contacts with pagination
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          message: true,
          read: true,
          createdAt: true,
        }
      }),
      prisma.contact.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Stats endpoint
export async function HEAD() {
  try {
    const [total, unread, thisMonth] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({
        where: { read: false }
      }),
      prisma.contact.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total,
        unread,
        thisMonth
      }
    });

  } catch (error) {
    console.error('Error fetching contact stats:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}