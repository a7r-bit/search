import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { LikedDirectory } from '@prisma/client';
import { LikedDirectoryDTO, ToggleLikedDirectory } from './dto';

@Injectable()
export class LikedDirectoryService {
  constructor(private readonly prisma: PrismaService) { }


  async findLikedDirectories(userId: string): Promise<LikedDirectoryDTO[]> {
    const directories = await this.prisma.directory.findMany({
      where: { likedBy: { some: { userId } } },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            children: true,
            documents: true
          }
        }
      }
    });
    return directories.map(dir => ({
      id: dir.id,
      name: dir.name,
      childrenCount: dir._count.children,
      documentCount: dir._count.documents,
    }));
  }

  async findOne(userId: string, directoryId: string): Promise<LikedDirectory | null> {
    const directory = await this.prisma.directory.findUnique({ where: { id: directoryId } });
    if (!directory) {
      throw new NotFoundException('Директория не найдена');
    }
    return await this.prisma.likedDirectory.findUnique({ where: { userId_directoryId: { userId, directoryId } } });
  }

  async toggle(userId: string, directoryId: string): Promise<ToggleLikedDirectory> {
    console.log({ userId: userId, directoryId: directoryId });

    const isExist = await this.findOne(userId, directoryId);
    if (isExist) {
      await this.remove(userId, directoryId);
      return { status: "deleted", directoryId: directoryId };
    }
    await this.create(userId, directoryId);
    return { status: "created", directoryId: directoryId };
  }

  async create(userId: string, directoryId: string): Promise<LikedDirectory> {
    const isExist = await this.findOne(userId, directoryId);
    if (isExist) {
      throw new BadRequestException('Директория уже добавлена в избранное');
    }
    return await this.prisma.likedDirectory.create({
      data: {
        userId,
        directoryId
      }
    })
  }

  async remove(userId: string, directoryId: string): Promise<LikedDirectory> {
    const isExist = await this.findOne(userId, directoryId);
    if (!isExist) {
      throw new BadRequestException('Директория не найдена в избранном');
    }
    return await this.prisma.likedDirectory.delete({
      where: { userId_directoryId: { userId, directoryId } }
    })
  }
}
