import { ApiProperty } from "@nestjs/swagger";

export class ToggleLikedDirectoryBody {
    @ApiProperty({ description: 'ID директории', example: 'a9477640-7812-41ba-a616-2f124a6ecc98' })
    directoryId: string;
}
