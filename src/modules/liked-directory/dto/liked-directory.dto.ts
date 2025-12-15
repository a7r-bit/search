import { ApiProperty } from "@nestjs/swagger"

export class LikedDirectoryDTO {
    @ApiProperty({
        example: "a9477640-7812-41ba-a616-2f124a6ecc98",
        description: "UUID каталога",
    })
    id: string

    @ApiProperty({
        example: "Каталог 1.0",
        description: "Название каталога",
    })
    name: string


    @ApiProperty({
        example: 10,
        description: "Количество дочерних директорий",
    })
    childrenCount: number


    @ApiProperty({
        example: 4,
        description: "Количеств дочерних документов",
    })
    documentCount: number
}