import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EmplayersParserService } from './emplayees_parser.service';
import { DepartmentExternalDto, UserExternalDto } from './dto/user-external.dto';

@Controller('employees-parser')
export class EmplayersParserController {
    constructor(private readonly service: EmplayersParserService) { }
    @Get('users')
    async getUsersList(
        @Query('page') page = 1,
        @Query('limit') limit = 100,
        @Query('order_dir') order_dir = 'asc',
    ): Promise<UserExternalDto[]> {
        return await this.service.getUsersList(Number(page), Number(limit), order_dir);
    }

    @Get('departments')
    async getDepartmentsList(
        @Query('page') page = 1,
        @Query('limit') limit = 100,
        @Query('order_dir') order_dir = 'asc',
    ): Promise<DepartmentExternalDto[]> {
        return await this.service.getDepartmentsList(Number(page), Number(limit), order_dir);
    }

    @Get('user/:tabNumber')
    async getUserByTabNumber(@Param('tabNumber') tabNumber: string): Promise<UserExternalDto> {
        return await this.service.getUserByTabNumber(tabNumber);
    }
}
