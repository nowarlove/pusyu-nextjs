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

    // Await params before using its properties
    const { id } = await params;

    const article = await prisma.article.findUnique({
      where: { id: id }
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
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

    // Await params before using its properties
    const { id } = await params;
    const body = await request.json();
    const { title, slug, content, excerpt, image, published, tags } = body;

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id: id }
    });

    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Check if slug is being changed and if new slug already exists
    if (slug !== existingArticle.slug) {
      const slugExists = await prisma.article.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
      }
    }

    // Convert tags array to JSON string for storage
    const tagsString = Array.isArray(tags) ? JSON.stringify(tags) : tags;

    const article = await prisma.article.update({
      where: { id: id },
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

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
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

    // Await params before using its properties
    const { id } = await params;

    const article = await prisma.article.findUnique({
      where: { id: id }
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    await prisma.article.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}