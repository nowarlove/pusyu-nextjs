import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
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
    const { title, slug, content, excerpt, image, published, tags } = body;

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug }
    });

    if (existingArticle) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Convert tags array to JSON string for storage
    const tagsString = Array.isArray(tags) ? JSON.stringify(tags) : tags;

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        image: image || null,
        published: published || false,
        tags: tagsString || null
      }
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}