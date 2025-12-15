import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentVersionDto } from './dto/create-document-version.dto';
import { UpdateDocumentVersionDto } from './dto/update-document-version.dto';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentService } from '../document/document.service';
import { DocumentVersion, MediaFile, Prisma } from '@prisma/client';
import { DocumentConversionService } from '../bullmq/document-conversion.service';
import { FileStorageService } from '../file-storage/file-storage.service';
import path from 'path';
import { DocumentVersionDto } from './dto/document-version.dto';
import { DocumentVersionFilterDto } from './dto/document_version_filter_dto ';
import { SortingParam } from 'src/common/decorators/sorting-params.decorator';
import { SearchService } from '../search';
import { ElasticTypes, ModelType } from 'src/common/constants';
import { instanceToPlain } from 'class-transformer';
import { DocumentVersionIndexDto } from 'src/common/elasic-search-models';


@Injectable()
export class DocumentVersionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documentService: DocumentService,
    private readonly fileStorageService: FileStorageService,
    private readonly documentConversionService: DocumentConversionService,
    private readonly searchService: SearchService,

  ) { }
  private async getLastVersion(documentId: string, tx: Prisma.TransactionClient): Promise<number> {
    const lastVersion = await tx.documentVersion.findFirst({
      where: { documentId },
      orderBy: { version: 'desc' }
    });
    return lastVersion?.version ?? 0
  }

  private async isUnique(documentId: string, versionForCheck: number): Promise<boolean> {
    const isUnique = await this.prisma.documentVersion.findUnique({
      where: {
        version_documentId: {
          documentId,
          version: versionForCheck
        }
      }
    })
    return isUnique ? false : true
  }
  private async findManyByIds(documentVersionIds: string[]) {
    const documentVersions = await this.prisma.documentVersion.findMany({
      where: {
        id: { in: documentVersionIds }
      },
      include: { mediaFile: true }
    })
    return documentVersions
  }

  async findAll(): Promise<DocumentVersionDto[]> {
    const documents = await this.prisma.documentVersion.findMany({ orderBy: { documentId: 'desc' }, include: { mediaFile: true } })
    return documents.map((el) => new DocumentVersionDto(el, ModelType.DocumentVersion))
  }


  async findOneById(id: string): Promise<DocumentVersionDto> {
    const foundVersion = await this.prisma.documentVersion.findUnique({
      where: { id },
      include: { mediaFile: true },
    });

    if (!foundVersion) {
      throw new NotFoundException('Документ с id: ' + id + ' не найден');
    }

    return new DocumentVersionDto(foundVersion, ModelType.DocumentVersion);
  }



  async searchFile(currentDirectoryId: string | null, searchQuery: string): Promise<DocumentVersionDto[]> {
    console.log(currentDirectoryId, searchQuery);


    // Получение текущей директории и всех дочерних на 1-уровень в глубину
    const directories = await this.prisma.directory.findMany({
      where: {
        OR: currentDirectoryId
          ? [{ id: currentDirectoryId }, { parentId: currentDirectoryId }]
          : [{ parentId: null }]
      },
    });

    // Получение всех документов в ранее полученных директориях
    const documentsInDirectories = await this.documentService.findManyByDirectoryIds(directories.map(dir => dir.id));

    const elasticResult: any = await this.searchService.search(ElasticTypes.DocumentVersion, {
      bool: {
        must: [
          {
            match: {
              "content": {
                query: searchQuery,
                fuzziness: "AUTO"

              }
            }
          },
        ],
        should: [
          {
            multi_match: {
              query: searchQuery,
              fields: ["fileName^2"],
              type: "best_fields"
            }
          }
        ],
        filter: [
          { terms: { "documentId": documentsInDirectories.map(doc => doc.id) } }
        ]
      }
    })
    console.log(elasticResult.body.hits);

    const findedVersions = await this.findManyByIds(elasticResult.body.hits.hits.map(version => version._id))
    return findedVersions.map(version => new DocumentVersionDto(version, ModelType.DocumentVersion));
  }


  async findByDocumentId(documentId: string, filterDto?: DocumentVersionFilterDto, sort?: SortingParam): Promise<DocumentVersionDto[]> {

    const { fileName, conversionStatus } = filterDto || {};

    const where: Prisma.DocumentVersionWhereInput = {
      documentId,
      ...(conversionStatus && { conversionStatus }),
      ...(fileName && { mediaFile: { fileName: { contains: fileName, mode: 'insensitive' } } })
    };

    const orderBy: Prisma.DocumentVersionOrderByWithRelationInput[] = [];

    if (sort) {
      if (sort.property === 'fileName') {
        orderBy.push({ mediaFile: { fileName: sort.direction as Prisma.SortOrder } });
      } else {
        orderBy.push({ [sort.property]: sort.direction });
      }
    } else {
      orderBy.push({ version: 'asc' });
    }

    const documents = await this.prisma.documentVersion.findMany({
      where: where,
      orderBy: orderBy,
      include: { mediaFile: true }
    });

    return documents.map((el) => new DocumentVersionDto(el, ModelType.DocumentVersion));
  }

  async create(createDocumentVersionDto: CreateDocumentVersionDto, file: Express.Multer.File): Promise<DocumentVersionDto> {
    const { documentId } = createDocumentVersionDto
    await this.documentService.findOne(documentId);

    const ext = path.extname(file.originalname).toLocaleLowerCase();

    const isPDF = ext == ".pdf"
    const savedDir = isPDF ? "./uploads/converted" : "./uploads/original";


    const savedFilePath = await this.fileStorageService.saveFileToDisk(file, savedDir)

    const documentVersion = await this.prisma.$transaction(async (tx) => {

      const lastVersion = await this.getLastVersion(documentId, tx);
      const newVersion = await tx.documentVersion.create({
        data: { documentId, version: lastVersion + 1, conversionStatus: isPDF ? 'DONE' : 'PENDING' },
      });
      await tx.mediaFile.create({
        data: {
          filePath: savedFilePath,
          fileName: path.basename(await this.fileStorageService.convertOriginalName(file.originalname), path.extname(file.originalname)),
          extention: path.extname(file.originalname),
          documentVersionId: newVersion.id,
        }
      })

      return await tx.documentVersion.findUniqueOrThrow({
        where: { id: newVersion.id },
        include: { mediaFile: true },
      });
    });
    await this.documentConversionService.addConversionJob(documentVersion.id, file.buffer, isPDF);

    return new DocumentVersionDto(documentVersion, ModelType.DocumentVersion)

  }

  async update(id: string, updateDocumentVersionDto: UpdateDocumentVersionDto): Promise<DocumentVersionDto> {
    const { version, fileName } = updateDocumentVersionDto;

    const documentVersion = await this.findOneById(id);

    if (!documentVersion.mediaFile?.id) {
      throw new NotFoundException('Файл документа не найден');
    }

    const mediaFile = await this.prisma.mediaFile.findUnique({
      where: { id: documentVersion.mediaFile.id },
    });

    if (!mediaFile) {
      throw new NotFoundException('Файл документа не найден');
    }

    const isVersionChanged = version !== documentVersion.version;
    const isFileNameChanged = fileName !== mediaFile.fileName;


    if (isVersionChanged) {
      const isUnique = await this.isUnique(documentVersion.documentId, version);
      if (!isUnique) {
        throw new BadRequestException(`Документ с версией ${version} уже существует`);
      }
    }
    const updatedDocumentVersion = await this.prisma.documentVersion.update({
      where: { id },
      data: {
        version: isVersionChanged ? version : documentVersion.version,
        mediaFile: {
          update: {
            fileName: isFileNameChanged ? fileName : mediaFile.fileName
          }
        }
      },
      include: {
        mediaFile: true,
      },
    });

    await this.searchService.updateDocument(ElasticTypes.DocumentVersion, updatedDocumentVersion.id,
      {
        documentId: updatedDocumentVersion.documentId,
        filename: updatedDocumentVersion.mediaFile?.fileName,
        path: '/' + updatedDocumentVersion.mediaFile?.filePath.replace(/\\/g, '/'),
        version: updatedDocumentVersion.version
      })

    return new DocumentVersionDto(updatedDocumentVersion, ModelType.DocumentVersion);


  }

  async remove(id: string): Promise<DocumentVersionDto> {
    await this.findOneById(id);
    const deletedDocument = await this.prisma.documentVersion.delete({ where: { id }, include: { mediaFile: true }, })
    if (deletedDocument.mediaFile) {
      await this.fileStorageService.deleteFileFromDics(deletedDocument.mediaFile.filePath);
      await this.searchService.deleteDocument(ElasticTypes.DocumentVersion, deletedDocument.id);
    }

    return new DocumentVersionDto(deletedDocument, ModelType.DocumentVersion);
  }

}