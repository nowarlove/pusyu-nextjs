import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await params before using its properties
    const { slug } = await params;
    
    const article = await prisma.article.findUnique({
      where: { 
        slug: slug,
        published: true
      }
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Parse tags
    const articleWithParsedTags = {
      ...article,
      tags: article.tags ? JSON.parse(article.tags) : []
    };

    return NextResponse.json(articleWithParsedTags);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}