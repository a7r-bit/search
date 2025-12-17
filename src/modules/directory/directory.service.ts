// import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
// import { CreateDirectoryDto } from './dto/create-directory.dto';
// import { UpdateDirectoryDto } from './dto/update-directory.dto';
// import { PrismaService } from '../prisma/prisma.service';
// import { Directory } from '@prisma/client';
// import { DocumentService } from '../document/document.service';
// import { PathPart } from '../../common/path-part.dto';
// import { DirectoryDTO } from './dto';
// import { ElasticTypes, ModelType } from 'src/common/constants';
// import { SearchService } from '../search';
// import { DirectoryIndex } from 'src/common/elasic-search-models';
// import { instanceToPlain } from 'class-transformer';

// @Injectable()
// export class DirectoryService {
//   constructor(
//     private readonly prisma: PrismaService,
//     @Inject(forwardRef(() => DocumentService))
//     private readonly documentService: DocumentService,
//     private readonly searchService: SearchService,
//   ) { }

//   async findAll(): Promise<DirectoryDTO[]> {
//     const directories = await this.prisma.directory.findMany()
//     return directories.map(dir => new DirectoryDTO(dir, ModelType.Directory))
//   }
//   // TODO нужно или нет для фронта
//   async findChildren(parentId: string | null): Promise<[]> {

//     const directories = await this.prisma.directory.findMany({
//       where: { parentId },
//     });

//     const dirNodes = directories.map((dir) => ({
//       id: dir.id,
//       type: 'directory' as const,
//       name: dir.name,
//       parentId: dir.parentId,

//       description: null,
//       createdAt: dir.createdAt.toISOString(),
//       updatedAt: dir.updatedAt.toISOString(),
//     }));

//     let docNodes: any[] = [];
//     if (parentId) {
//       const documents = await this.prisma.document.findMany({
//         where: { directoryId: parentId },
//       });

//       docNodes = documents.map((doc) => ({
//         id: doc.id,
//         type: 'document' as const,
//         name: doc.title,
//         description: doc.description || null,
//         parentId: doc.directoryId,
//         createdAt: doc.createdAt.toISOString(),
//         updatedAt: doc.updatedAt.toISOString(),
//       }));
//     }

//     return [...dirNodes, ...docNodes].sort((a, b) => a.name.localeCompare(b.name)) as any;
//   }

//   async getPath(id: string | null): Promise<PathPart[]> {
//     const parts: PathPart[] = [];

//     let currentId = id;
//     while (currentId) {
//       const dir = await this.prisma.directory.findUnique({
//         where: { id: currentId },
//         select: { id: true, name: true, parentId: true },
//       });

//       if (!dir) break;

//       parts.unshift({ id: dir.id, name: dir.name });
//       currentId = dir.parentId;
//     }

//     parts.unshift({ id: null, name: '...' });

//     return parts;
//   }



//   private async isUnique(directoryDto: UpdateDirectoryDto): Promise<boolean> {
//     const { name, parentId } = directoryDto
//     const directory = await this.prisma.directory.findFirst({ where: { name: name, parentId: parentId } })

//     if (directory) {
//       return false
//     }

//     return true
//   }

//   private async getAllChildren(id: string): Promise<Directory[]> {
//     const children = await this.prisma.directory.findMany({ where: { parentId: id } });
//     let directories: Directory[] = [];
//     for (const child of children) {
//       directories.push(child);
//       const subChild = await this.getAllChildren(child.id);
//       directories.concat(subChild)
//     }

//     return directories
//   }

//   async findOne(id: string): Promise<DirectoryDTO> {
//     const directory = await this.prisma.directory.findUnique({ where: { id: id }, include: { children: true, parent: true } })

//     if (!directory) {
//       throw new NotFoundException(`Директория с id: ${id} не найдена`);
//     }

//     return new DirectoryDTO(directory, ModelType.Directory);
//   }

//   async create(createDirectoryDto: CreateDirectoryDto): Promise<DirectoryDTO> {
//     let parent: DirectoryDTO | null = null;
//     const { name, parentId } = createDirectoryDto;
//     const isUnique = await this.isUnique(createDirectoryDto);

//     if (parentId) {
//       parent = await this.findOne(parentId);
//     }

//     if (!isUnique) {
//       const parentName = parent ? `в ${parent.name}` : 'на верхнем уровне';
//       throw new BadRequestException(`Директория с именем ${name} уже существует ${parentName}.`);
//     }

//     const directory = await this.prisma.directory.create({ data: createDirectoryDto });
//     await this.searchService.indexDocument(ElasticTypes.Directory, directory.id, new DirectoryIndex(directory.name, directory.parentId))

//     return new DirectoryDTO(directory, ModelType.Directory);
//   }

//   async update(id: string, updateDirectoryDto: UpdateDirectoryDto): Promise<DirectoryDTO> {


//     const { name, parentId } = updateDirectoryDto
//     const directory = await this.findOne(id);

//     if (updateDirectoryDto.parentId) {
//       if (updateDirectoryDto.parentId === id) {
//         throw new BadRequestException('Директория не может быть родителем самой себя.');
//       }

//       const allChildren = await this.getAllChildren(id);
//       const allChildrenIds = allChildren.map(d => d.id);
//       if (allChildrenIds.includes(updateDirectoryDto.parentId)) {
//         throw new BadRequestException('Нельзя переместить директорию в свою же поддиректорию.');
//       }
//     }

//     if (updateDirectoryDto.name && updateDirectoryDto.name !== directory.name) {

//       const isUnique = await this.isUnique(updateDirectoryDto);

//       if (!isUnique) {
//         const parentName = directory.parentId ? (await this.findOne(directory.parentId)).name : 'на верхнем уровне';
//         throw new BadRequestException(`Директория с именем ${updateDirectoryDto.name} уже существует ${parentName}.`);
//       }
//     }

//     const updatedDirectory = await this.prisma.directory.update({ where: { id }, data: { name, parentId } })
//     await this.searchService.updateDocument(ElasticTypes.Directory, updatedDirectory.id, instanceToPlain(new DirectoryIndex(updatedDirectory.name, updatedDirectory.parentId)))

//     return new DirectoryDTO(updatedDirectory, ModelType.Directory);
//   }

//   async remove(id: string): Promise<DirectoryDTO> {
//     const directory = await this.prisma.directory.findUnique({ where: { id }, include: { children: true, documents: true } });
//     if (!directory) {
//       throw new NotFoundException(`Директория с id: ${id} не найдена`);
//     }
//     for (const child of directory.children) {
//       await this.remove(child.id);
//     }
//     await this.documentService.removeMany(directory.id);

//     const deletedDirectory = await this.prisma.directory.delete({ where: { id: directory.id } });
//     await this.searchService.deleteDocument(ElasticTypes.Directory, deletedDirectory.id)

//     return new DirectoryDTO(deletedDirectory, ModelType.Directory)
//   }
// }
