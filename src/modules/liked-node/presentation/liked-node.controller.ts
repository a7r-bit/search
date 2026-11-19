import { Body, Controller, Get, Post } from '@nestjs/common';
import { LikedNodeService } from '../application/liked-node.service';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { NodeDto } from '../../node/presentation/dto/node.dto';
import { CustomParseUUIDPipe } from '../../../shared/presentation/pipes/custom-parse-uuid.pipe';
import { User } from '../../../shared/presentation/decorators/user.decorator';
import { RequestUser } from '../../../shared/domain/types/request-user';

@Controller('liked-node')
export class LikedNodeController {
    constructor(private readonly likedNodeService: LikedNodeService) {}

    @Get()
    @ApiOperation({
        summary: 'Получение сохраненных Node пользователя',
        description: `
    Эндпоит возвращает массив Node сохраненный пользователем.
    Пользователь определется по id полученному из access-токена.
    `,
    })
    @ApiOkResponse({
        type: [NodeDto],
        description: 'Успешный ответ',
    })
    async findAllLikedDir(@User() user: RequestUser) {
        return await this.likedNodeService.getMyLikedNodes(user.id);
    }

    @Post()
    @ApiOperation({
        summary: 'Добавление/Удаление node в сохраненные.',
        description: `
    Эндпоинт сохраняет node пользователю путем передачи nodeId и id пользователя из access-токена
    `,
    })
    @ApiOkResponse({
        type: NodeDto,
        description: 'Успешный ответ',
    })
    @ApiBody({ type: String, required: true, description: 'nodeId' })
    async toggleLikedDir(@User() user: RequestUser, @Body('nodeId', new CustomParseUUIDPipe()) nodeId: string) {
        return await this.likedNodeService.toggleNode(user.id, nodeId);
    }
}
