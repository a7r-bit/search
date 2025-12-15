import { BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PrismaService } from '../prisma';
import { DirectoryService } from '../directory';
import { SearchService } from '../search';
import { ElasticTypes, ModelType } from 'src/common/constants';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentDTO } from './dto/document.dto';
import { DocumentIndex } from 'src/common/elasic-search-models';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { instanceToPlain } from 'class-transformer';

async function safeDeleteFile(filePath: string) {
  try {
    const trashDir = path.join("uploads", "trash");
    await fs.mkdir(trashDir, { recursive: true });
    const fileName = path.basename(filePath);
    const trashPath = path.join(trashDir, fileName);
    await fs.rename(filePath, trashPath);
    return trashPath;
  } catch (e: any) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
    return null;
  }
}

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => DirectoryService))
    private readonly directoryService: DirectoryService,
    private readonly searchService: SearchService,
  ) { }

  private async isUnique(createDocumentDto: CreateDocumentDto): Promise<boolean> {
    const { title, directoryId, description } = createDocumentDto
    const document = await this.prisma.document.findUnique({ where: { title_directoryId: { title, directoryId } } })
    if (document) {
      return false
    }
    return true
  }

  async findAll(): Promise<DocumentDTO[]> {

    const documents = await this.prisma.document.findMany();
    return documents.map(doc => new DocumentDTO(doc, ModelType.Document))
  }

  async findManyByDirectoryIds(directoryIds: string[]) {
    return await this.prisma.document.findMany({
      where: { directoryId: { in: directoryIds } }
    });

  }

  async findOne(id: string): Promise<DocumentDTO> {
    const document = await this.prisma.document.findUnique({ where: { id } })
    if (!document) {
      throw new NotFoundException("Запись не найдена")
    }
    return new DocumentDTO(document, ModelType.Document);
  }

  async create(createDocumentDto: CreateDocumentDto): Promise<DocumentDTO> {
    const { title, description, directoryId } = createDocumentDto
    const directory = await this.directoryService.findOne(directoryId)
    const isUnique = await this.isUnique(createDocumentDto);
    if (!isUnique) {
      throw new BadRequestException(`Запись с имененм ${title} уже существует в директории ${directory.name}`)
    }
    const document = await this.prisma.document.create({ data: createDocumentDto });

    await this.searchService.indexDocument(
      ElasticTypes.Document,
      document.id,
      new DocumentIndex(document.title, document.description, document.directoryId));

    return new DocumentDTO(document, ModelType.Document);
  }




  async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<DocumentDTO> {
    const { title, description, directoryId } = updateDocumentDto
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) {
      throw new NotFoundException("Запись не найдена")
    }
    if ((title && title !== document.title) || (directoryId && directoryId !== document.directoryId)) {
      await this.directoryService.findOne(directoryId ?? document.directoryId)
      const isUnique = await this.isUnique({
        title: title ?? document.title,
        directoryId: directoryId ?? document.directoryId,
      });
      if (!isUnique) {
        const directory = await this.directoryService.findOne(directoryId ?? document.directoryId);
        throw new BadRequestException(`Документ с именем ${title ?? document.title} уже существует в директории ${directory.name}`);
      }
    }

    const baseDoc = await this.prisma.document.update({ where: { id }, data: { title: title, description: description, directoryId: directoryId } })

    await this.searchService.updateDocument(
      ElasticTypes.Document,
      baseDoc.id,
      instanceToPlain(new DocumentIndex(baseDoc.title, baseDoc.description, baseDoc.directoryId))
    )

    return new DocumentDTO(baseDoc, ModelType.Document,)

  }

  async remove(id: string): Promise<DocumentDTO> {
    const baseDoc = await this.prisma.document.findUnique({ where: { id } });
    if (!baseDoc) {
      throw new NotFoundException("Запись не найдена")
    }
    const versions = await this.prisma.documentVersion.findMany({
      where: { documentId: id },
      include: { mediaFile: true }
    });

    const movedFiles: { from: string, to: string }[] = [];

    try {
      for (const version of versions) {
        if (version.mediaFile && version.mediaFile.filePath) {
          const trashPath = await safeDeleteFile(version.mediaFile.filePath);
          if (trashPath) {
            movedFiles.push({ from: trashPath, to: version.mediaFile.filePath });
          }
        }
      }

      await this.prisma.$transaction(async (tx) => {
        for (const version of versions) {
          if (version.mediaFile) {
            await tx.mediaFile.delete({ where: { id: version.mediaFile.id } });
          }
        }
        await tx.documentVersion.deleteMany({ where: { documentId: id } });
        await tx.document.delete({ where: { id } });
      });

      for (const file of movedFiles) {
        try {
          await fs.unlink(file.from);

          for (const version of versions) {
            await this.searchService.deleteDocument(ElasticTypes.DocumentVersion, version.id);
          }

        } catch (e) {
          // Логировать ошибку удаления из корзины
        }
      }

      await this.searchService.deleteDocument(ElasticTypes.Document, baseDoc.id);
      return new DocumentDTO(baseDoc, ModelType.Document)

    } catch (err) {
      // Откат: возвращаем файлы из корзины на место
      for (const file of movedFiles) {
        try {
          await fs.rename(file.from, file.to);
        } catch (e) {
          // Логировать ошибку восстановления файла
        }
      }
      throw err;
    }
  }

  async removeMany(directoryId: string) {
    const documents = await this.prisma.document.findMany({ where: { directoryId } });
    for (const doc of documents) {
      await this.remove(doc.id);
    }
    return await this.prisma.document.deleteMany({ where: { directoryId: directoryId } })
  }
}
