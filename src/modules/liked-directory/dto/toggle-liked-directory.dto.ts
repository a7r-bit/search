import { ApiProperty } from '@nestjs/swagger';

export class ToggleLikedDirectory {
    @ApiProperty({ description: 'Статус операции', enum: ['created', 'deleted'] })
    status: 'created' | 'deleted';

    @ApiProperty({ description: 'ID директории, которая была добавлена или удалена' })
    directoryId: string;
}
