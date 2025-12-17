import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { LikedNodeService } from './liked-node.service';
import { CustomParseUUIDPipe } from 'src/common/pipes';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { NodeDto } from '../node/dto/node.dto';

@Controller('liked-node')
export class LikedNodeController {
  constructor(private readonly likedNodeService: LikedNodeService) { }

  @Get()
  @ApiOperation({
    summary: "Получение сохраненных Node пользователя",
    description: `
    Эндпоит возвращает массив Node сохраненный пользователем.
    Пользователь определется по id полученному из access-токена.
    `
  })
  @ApiOkResponse({
    type: [NodeDto], description: "Успешный ответ",
  })
  async findAllLikedDir(@Req() req) {
    return await this.likedNodeService.getMyLikedNodes(req.user.id);
  }

  @Post()
  @ApiOperation({
    summary: "Добавление/Удаление node в сохраненные.",
    description: `
    Эндпоинт сохраняет node пользователю путем передачи nodeId и id пользователя из access-токена
    `,
  })
  @ApiOkResponse({
    type: NodeDto, description: "Успешный ответ",
  })
  async toggleLikedDir(@Req() req, @Body("nodeId", new CustomParseUUIDPipe()) nodeId: string
  ) {
    console.log(req.user, nodeId);

    return await this.likedNodeService.toggleNode(req.user.id, nodeId);
  }
}
