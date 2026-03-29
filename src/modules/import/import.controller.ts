import { Body, Controller, Post } from '@nestjs/common';
import { ImportService } from './import.service';
import { ImportDirectoryDto } from './dto/import-directory.dto';

@Controller('import')
export class ImportController {
    constructor(private readonly importService: ImportService) {}

    @Post()
    async importDirectory(@Body() dto: ImportDirectoryDto) {
        return await this.importService.importDirectory(dto.path, dto.parentNodeId);
    }
}
