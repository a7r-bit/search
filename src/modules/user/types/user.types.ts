// import { Prisma } from "@prisma/client";

import { Prisma } from '@prisma/client';

export type UserWithRoles = Prisma.UserGetPayload<{
    include: { role: true };
}>;

export type UserWithRolesAndPermissions = Prisma.UserGetPayload<{
    include: { role: { include: { permissions: true } } };
}>;
