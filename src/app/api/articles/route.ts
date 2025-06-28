import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      published: true
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (tag) {
      where.tags = { contains: tag };
    }

    // Get articles
    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        tags: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Get total count
    const total = await prisma.article.count({ where });

    // Parse tags for each article
    const articlesWithParsedTags = articles.map(article => ({
      ...article,
      tags: article.tags ? JSON.parse(article.tags) : []
    }));

    // Filter by featured if requested
    let filteredArticles = articlesWithParsedTags;
    if (featured === 'true') {
      // You can implement featured logic based on your needs
      // For now, we'll assume first 3 articles are featured
      filteredArticles = articlesWithParsedTags.slice(0, 3);
    }

    return NextResponse.json({
      articles: filteredArticles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}