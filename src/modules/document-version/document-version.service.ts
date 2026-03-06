import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentVersionDto } from './dto/create-document-version.dto';
import { UpdateDocumentVersionDto } from './dto/update-document-version.dto';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentConversionService } from '../bullmq/document-conversion.service';
import { FileStorageService } from '../file-storage/file-storage.service';
import path from 'path';
import { DocumentVersionDto } from './dto/document-version.dto';
import { DocumentVersionFilterDto } from './dto/document_version_filter_dto ';
import { SearchService } from '../search';
import { Prisma } from '@prisma/client';
import { ElasticTypes } from '../../common/constants';
import { SortingParam } from '../../common/decorators/sorting-params.decorator';


@Injectable()
export class DocumentVersionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fileStorageService: FileStorageService,
        private readonly documentConversionService: DocumentConversionService,
        private readonly searchService: SearchService,

    ) { }
    private async getLastVersion(nodeId: string, tx: Prisma.TransactionClient): Promise<number> {
        const lastVersion = await tx.documentVersion.findFirst({
            where: { nodeId },
            orderBy: { version: 'desc' }
        });
        return lastVersion?.version ?? 0
    }

    private async isUnique(nodeId: string, versionForCheck: number): Promise<boolean> {
        const isUnique = await this.prisma.documentVersion.findUnique({
            where: {
                version_nodeId: {
                    version: versionForCheck,
                    nodeId

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
        const documents = await this.prisma.documentVersion.findMany({ orderBy: { nodeId: 'desc' }, include: { mediaFile: true } })
        return documents.map((el) => new DocumentVersionDto(el))
    }


    async findOneById(id: string): Promise<DocumentVersionDto> {
        const foundVersion = await this.prisma.documentVersion.findUnique({
            where: { id },
            include: { mediaFile: true },
        });

        if (!foundVersion) {
            throw new NotFoundException('Документ с id: ' + id + ' не найден');
        }

        return new DocumentVersionDto(foundVersion);
    }


    async findByNodeId(nodeId: string, filterDto?: DocumentVersionFilterDto, sort?: SortingParam): Promise<DocumentVersionDto[]> {

        const { fileName, conversionStatus } = filterDto || {};

        const where: Prisma.DocumentVersionWhereInput = {
            nodeId,
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

        return documents.map((el) => new DocumentVersionDto(el));
    }

    async create(createDocumentVersionDto: CreateDocumentVersionDto, file: Express.Multer.File): Promise<DocumentVersionDto> {
        const { nodeId } = createDocumentVersionDto
        const node = await this.prisma.node.findUnique({ where: { id: nodeId, type: 'DOCUMENT' } });
        if (!node) {
            throw new NotFoundException("Родительский докумет не найден")
        }

        const ext = path.extname(file.originalname).toLocaleLowerCase();

        const isPDF = ext == ".pdf"
        const savedDir = isPDF ? "./uploads/converted" : "./uploads/original";


        const savedFilePath = await this.fileStorageService.saveFileToDisk(file, savedDir)

        const documentVersion = await this.prisma.$transaction(async (tx) => {

            const lastVersion = await this.getLastVersion(nodeId, tx);
            const newVersion = await tx.documentVersion.create({
                data: { nodeId, version: lastVersion + 1, conversionStatus: 'PENDING' },
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
        await this.documentConversionService.addConversionJob(documentVersion.id, savedFilePath, isPDF);

        return new DocumentVersionDto(documentVersion)

    }

    async createFromPath(createDocumentVersionDto: CreateDocumentVersionDto, filePath: string): Promise<DocumentVersionDto> {
        const { nodeId } = createDocumentVersionDto
        const node = await this.prisma.node.findUnique({ where: { id: nodeId, type: 'DOCUMENT' } });
        if (!node) {
            throw new NotFoundException("Родительский докумет не найден")
        }

        const ext = path.extname(filePath).toLocaleLowerCase();

        const isPDF = ext == ".pdf"
        // const savedDir = isPDF ? "./uploads/converted" : "./uploads/original";


        // const savedFilePath = await this.fileStorageService.saveFileToDisk(file, savedDir)

        const documentVersion = await this.prisma.$transaction(async (tx) => {

            const lastVersion = await this.getLastVersion(nodeId, tx);

            const newVersion = await tx.documentVersion.create({
                data: { nodeId, version: lastVersion + 1, conversionStatus: 'PENDING' },
            });

            await tx.mediaFile.create({
                data: {
                    filePath: filePath,
                    fileName: path.basename(filePath, ext),
                    extention: ext,
                    documentVersionId: newVersion.id,
                }
            })

            return await tx.documentVersion.findUniqueOrThrow({
                where: { id: newVersion.id },
                include: { mediaFile: true },
            });
        });
        await this.documentConversionService.addConversionJob(documentVersion.id, filePath, isPDF);

        return new DocumentVersionDto(documentVersion)

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
            const isUnique = await this.isUnique(documentVersion.nodeId, version);
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
                nodeId: updatedDocumentVersion.nodeId,
                fileName: updatedDocumentVersion.mediaFile?.fileName,
                path: '/' + updatedDocumentVersion.mediaFile?.filePath.replace(/\\/g, '/'),
                version: updatedDocumentVersion.version
            })

        return new DocumentVersionDto(updatedDocumentVersion);


    }

    async remove(id: string): Promise<DocumentVersionDto> {
        await this.findOneById(id);
        const deletedDocument = await this.prisma.documentVersion.delete({ where: { id }, include: { mediaFile: true }, })
        if (deletedDocument.mediaFile) {
            await this.fileStorageService.deleteFileFromDics(deletedDocument.mediaFile.filePath);
        }
        await this.searchService.deleteDocument(ElasticTypes.DocumentVersion, deletedDocument.id);

        return new DocumentVersionDto(deletedDocument);
    }

    async removeByNodeId(nodeId: string): Promise<DocumentVersionDto[]> {
        //TODO Перевести удаление файлов на BullMq
        const node = await this.prisma.node.findUnique({ where: { id: nodeId } })
        if (!node) {
            throw new NotFoundException("Документ не найден");
        }
        const deletedDocuments = await this.prisma.documentVersion.findMany({ where: { nodeId: node.id }, include: { mediaFile: true }, })
        await this.prisma.documentVersion.deleteMany({ where: { id: { in: deletedDocuments.map(doc => doc.id) } } })
        for (const doc of deletedDocuments) {
            if (doc.mediaFile) {
                await this.fileStorageService.deleteFileFromDics(doc.mediaFile.filePath);
            }
            try {
                await this.searchService.deleteDocument(ElasticTypes.DocumentVersion, doc.id);
            } catch (e) {
                //Ошибка AxiosError: Request failed with status code 400
                //     at settle (/app/node_modules/axios/lib/core/settle.js:19:12)
                //     at IncomingMessage.handleStreamEnd (/app/node_modules/axios/lib/adapters/http.js:793:11)
                //     at IncomingMessage.emit (node:events:536:35)
                //     at endReadableNT (node:internal/streams/readable:1698:12)
                //     at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
                //     at Axios.request (/app/node_modules/axios/lib/core/Axios.js:45:41)
                //     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
                //     at async GotenbergService.convertDocxToPdf (/app/src/modules/gotenberg/gotenberg.service.ts:19:21)
                //     at async DocumentConversionProcessor.process (/app/src/modules/bullmq/document-conversion.processor.ts:41:15)
                //     at async <anonymous> (/app/node_modules/bullmq/src/classes/worker.ts:878:26)
                //     at async Worker.retryIfFailed (/app/node_modules/bullmq/src/classes/worker.ts:1247:16)
                // {
                //   message: 'DocumentVersionService: removeByNodeId',
                //   error: ResponseError: {"_index":"document_versions","_id":"0634b7e5-42e2-4c4d-88d0-f623511c27bc","_version":1,"result":"not_found","_shards":{"total":2,"successful":1,"failed":0},"_seq_no":119,"_primary_term":43}
                //       at SniffingTransport._request (/app/node_modules/@elastic/transport/src/Transport.ts:606:17)
                //       at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
                //       at async <anonymous> (/app/node_modules/@elastic/transport/src/Transport.ts:740:22)
                //       at async SniffingTransport.request (/app/node_modules/@elastic/transport/src/Transport.ts:737:14)
                //       at async ElasticsearchService.DeleteApi (/app/node_modules/@elastic/elasticsearch/src/api/api/delete.ts:71:10)
                //       at async SearchService.deleteDocument (/app/src/modules/search/search.service.ts:139:16)
                //       at async DocumentVersionService.removeByNodeId (/app/src/modules/document-version/document-version.service.ts:269:17)
                //       at async NodeService.delete (/app/src/modules/node/node.service.ts:168:17)
                //       at async NodeService.delete (/app/src/modules/node/node.service.ts:160:13)
                //       at async NodeController.remove (/app/src/modules/node/node.controller.ts:106:12) {
                //     options: { redaction: [Object] },
                //     meta: {
                //       body: [Object],
                //       statusCode: 404,
                //       headers: [Object],
                //       meta: [Object],
                //       warnings: null
                //     }
                //   }
                // }
                console.log({
                    message: "DocumentVersionService: removeByNodeId",
                    error: e,
                })
            }

        }

        return deletedDocuments.map(el => new DocumentVersionDto(el));
    }

}