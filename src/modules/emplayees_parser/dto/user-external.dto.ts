import { Expose, Type } from 'class-transformer';

export class UserExternalDto {
    @Expose()
    id: string;
    @Expose()
    surname: string;
    @Expose()
    fname: string;
    @Expose()
    lname: string;
    @Expose()
    tab_num: string;
    @Expose()
    @Type(() => DepartmentExternalDto)
    departments: DepartmentExternalDto[];
}

export class DepartmentExternalDto {
    @Expose()
    id: string;
    @Expose({ name: 'title' })
    name: string;
    @Type(() => DepartmentExternalDto)
    children?: DepartmentExternalDto[];
}
