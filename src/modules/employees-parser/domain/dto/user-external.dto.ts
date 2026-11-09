import { Expose, Type } from 'class-transformer';

export class UserExternalDto {
    @Expose()
    tab_num: string;
    @Expose()
    ldap_tab_num: string;
    @Expose()
    fname: string;
    @Expose()
    surname: string;
    @Expose()
    lname: string;
    @Expose()
    @Type(() => DepartmentExternalDto)
    departments: DepartmentExternalDto[];
}

export class DepartmentExternalDto {
    @Expose()
    id: string;

    @Expose({ name: 'title' })
    name: string;

    @Expose()
    @Type(() => DepartmentExternalDto)
    children?: DepartmentExternalDto[];
}
