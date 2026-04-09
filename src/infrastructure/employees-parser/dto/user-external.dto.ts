import { Expose, Type } from 'class-transformer';

export class UserExternalDto {
    @Expose()
    tab_num: string;
    @Expose()
    fname: string;
    @Expose()
    surname: string;
    @Expose()
    mname: string;
    @Expose()
    @Type(() => DepartmentExternalDto)
    departments: DepartmentExternalDto[];
}

export class DepartmentExternalDto {
    @Expose()
    id: string;
    @Expose()
    name: string;
    @Type(() => DepartmentExternalDto)
    children?: DepartmentExternalDto[];
}
