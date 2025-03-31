import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(private prisma: DatabaseService) {}

  async create(createArticleDto: Prisma.ArticleCreateInput) {
    return this.prisma.article.create({
      data: {
        ...createArticleDto,
        content: createArticleDto.content
      },
      include: { content: true }
    });
  }

  async findAll() {
    return this.prisma.article.findMany({
      include: { content: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: number) {
    return this.prisma.article.findUnique({
      where: { id },
      include: { content: true }
    });
  }

  async update(id: number, updateArticleDto: Prisma.ArticleUpdateInput) {
    // First, delete all existing content items for this article
    await this.prisma.contentItem.deleteMany({
      where: { articleId: id }
    });

    // Then update the article with new content items
    return this.prisma.article.update({
      where: { id },
      data: {
        title: updateArticleDto.title as string,
        category: updateArticleDto.category as string,
        content: updateArticleDto.content
      },
      include: { content: true }
    });
  }

  async remove(id: number) {
    return this.prisma.article.delete({
      where: { id }
    });
  }
}