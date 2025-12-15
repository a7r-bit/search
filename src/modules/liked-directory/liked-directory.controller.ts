import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Req } from "@nestjs/common";
import { LikedDirectoryService } from "./liked-directory.service";
import { LikedDirectoryDTO, ToggleLikedDirectory } from "./dto";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { CustomParseUUIDPipe } from "src/common/pipes/custom-parse-uuid.pipe";
import { ToggleLikedDirectoryBody } from "./dto/toggle-liked-directory-body.dto";

@Controller('liked-directory')
export class LikedDirectoryController {
  constructor(private readonly likedDirectoryService: LikedDirectoryService) { }

  @Get()
  @ApiOperation({
    summary: "Получение сохраненных директорий пользователя",
    description: `
    Эндпоит возвращает массив дирректорий сохраненный пользователем.
    Пользователь определется по id полученному из access-токена.
    `
  })
  @ApiOkResponse({
    type: [LikedDirectoryDTO], description: "Успешный ответ", example: [
      {
        "id": "a9477640-7812-41ba-a616-2f124a6ecc98",
        "name": "Каталог 1.0",
        "childrenCount": 0,
        "documentCount": 0
      },
      {
        "id": "ee99ddf7-8174-471d-bfe7-5666c9e4f710",
        "name": "Корневой каталог",
        "childrenCount": 1,
        "documentCount": 0
      }
    ]
  })

  async findAllLikedDir(@Req() req): Promise<LikedDirectoryDTO[]> {
    return await this.likedDirectoryService.findLikedDirectories(req.user.id);
  }

  @ApiOperation({
    summary: "Добавление/Удаление директории в сохраненные.",
    description: `
    Эндпоинт сохраняет директорию пользователю путем передачи directoryId и id пользователя из access-токена
    `,

  })
  @ApiOkResponse({
    type: ToggleLikedDirectory, description: "Успешный ответ", example: {
      "status": "deleted",
      "directoryId": "a9477640-7812-41ba-a616-2f124a6ecc98"
    }
  })
  @Post()
  async toggleLikedDir(@Req() req, @Body("directoryId", new CustomParseUUIDPipe()) directoryId: string
  ) {
    console.log({ directoryId: directoryId });

    return this.likedDirectoryService.toggle(req.user.id, directoryId);
  }


}
