import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });

    return bookmark;
  }

  async findAll(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId: userId,
      },
    });

    return bookmarks;
  }

  async findOne(id: number, userId: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id,
        userId,
      },
    });

    return bookmark;
  }

  async update(id: number, userId: number, dto: UpdateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new UnauthorizedException('Access to resource denied');
    }

    const updatedBookmark = await this.prisma.bookmark.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });

    return { data: updatedBookmark };
  }

  async remove(id: number, userId: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new UnauthorizedException('Access to resource denied');
    }

    await this.prisma.bookmark.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
