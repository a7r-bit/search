import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomParseUUIDPipe } from 'src/common/pipes/custom-parse-uuid.pipe';
import { Scope } from 'src/common/decorators';
import { FindUserQueryDto, UserDTO } from './dto';
import { UserMapper } from './mappers';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @ApiOperation({ summary: "Получение всех пользователей системы" })
  @ApiOkResponse({ type: [UserDTO], description: "Успешное получение" })
  @Scope("client:read")
  async findAll(@Query() query: FindUserQueryDto) {

    const users = await this.userService.findAll(query);
    return users.map(user => UserMapper.toDTO(user))
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiParam({ name: "id", type: String, description: 'UUID пользователя' })
  @ApiOkResponse({ type: UserDTO, description: "Успешное получение" })
  @ApiNotFoundResponse({
    description: 'Пользователь не найден',
    schema: {
      example: {
        message: 'Пользователь не найден',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Id не валиден',
    schema: {
      example: {
        message: 'ID не валиден.',
        errors: 'Validation failed (uuid is expected)',
      },
    },
  })

  async findOne(
    @Param('id', new CustomParseUUIDPipe()) id: string,
    @Query() query: FindUserQueryDto) {
    const user = await this.userService.findOne(id, query);
    return UserMapper.toDTO(user);
  }


  @Get('/by-uid_number/:uid')
  @ApiOperation({ summary: "Получение пользователя по UidNumber" })
  @ApiOkResponse({ type: UserDTO })
  @ApiNotFoundResponse({
    description: "Пользователь не найден", schema: {
      example: {
        message: "Not Found",
        statusCode: 404
      }
    }
  })

  async findByUidNumber(@Param('uid') uid: string, @Query() query: FindUserQueryDto) {
    const user = await this.userService.findByUidNumber(uid, query);
    return UserMapper.toDTO(user);

  }

  // @Post()
  // async create(@Body() createUserDto: CreateUserDto) {
  //   const user = await this.userService.create(createUserDto);
  //   return UserMapper.toDTO(user);

  // }


  // @Patch(':id')
  // async update(@Param('id', new CustomParseUUIDPipe()) id: string, @Body() updateUserDto: UpdateUserDto) {
  //   const user = await this.userService.update(id, updateUserDto);
  //   return UserMapper.toDTO(user);

  // }

  // @Delete(':id')
  // async remove(@Param('id', new CustomParseUUIDPipe()) id: string) {
  //   const user = await this.userService.remove(id);
  //   return UserMapper.toDTO(user);
  // }
}
