import { ForbiddenException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const ADMIN_TAB_NUMS = ['12513', '12755'];

const authenticate = async (username: string, password: string) => {
    if (!ADMIN_TAB_NUMS.includes(username)) {
        throw new ForbiddenException('Доступ запрещен');
    }
    if (!username || !password) return null;

    try {
        const {
            data: { user },
        } = await axios.post('http://127.0.0.1:3000/api/auth/signIn', {
            username,
            password,
        });
        return {
            id: user.id,
            uidNumber: user.uidNumber,
            email: `${user.firstName} ${user.middleName}`,
            title: user.uidNumber,
            roles: user.roles,
            activeRole: user.activeRole,
        };
    } catch (error) {
        throw new ForbiddenException(error);
    }
};

export const adminJsImport = import('@adminjs/nestjs').then(({ AdminModule }) =>
    AdminModule.createAdminAsync({
        useFactory: async () => {
            const { Database, Resource, getModelByName } = await import('@adminjs/prisma');
            const AdminJS = (await import('adminjs')).default;

            AdminJS.registerAdapter({ Database, Resource });

            const prisma = new PrismaClient();

            return {
                adminJsOptions: {
                    rootPath: '/admin',
                    resources: [
                        {
                            resource: { model: getModelByName('User'), client: prisma },
                            options: {
                                // Таблица списка
                                listProperties: ['id', 'uidNumber', 'firstName', 'middleName', 'groups', 'createdAt', 'updatedAt'],

                                // Карточка просмотра — сюда можно добавить связи
                                showProperties: [
                                    'id',
                                    'uidNumber',
                                    'firstName',
                                    'middleName',
                                    'groups',
                                    'roleNames',
                                    'politicsGroupNames',
                                    'likedNodeNames',
                                    'createdAt',
                                    'updatedAt',
                                ],

                                // Форма редактирования — только скаляры + простые связи
                                editProperties: ['uidNumber', 'firstName', 'middleName', 'groups', 'role'],

                                properties: {
                                    groups: {
                                        type: 'string',
                                        isArray: true,
                                        label: 'Группы (LDAP)',
                                        isVisible: { list: true, show: true, edit: true, filter: false },
                                    },
                                    roleNames: {
                                        type: 'string',
                                        label: 'Роли',
                                        isVisible: { list: false, show: true, edit: false, filter: false },
                                    },
                                    politicsGroupNames: {
                                        type: 'string',
                                        label: 'Политики (Group)',
                                        isVisible: { list: false, show: true, edit: false, filter: false },
                                    },
                                    likedNodeNames: {
                                        type: 'string',
                                        label: 'Избранные узлы',
                                        isVisible: { list: false, show: true, edit: false, filter: false },
                                    },
                                    role: {
                                        isVisible: { list: false, show: false, edit: true, filter: false },
                                    },
                                    likedNodes: {
                                        isVisible: { list: false, show: false, edit: false, filter: false },
                                    },
                                    politicsGroups: {
                                        isVisible: { list: false, show: false, edit: false, filter: false },
                                    },
                                    refreshToken: {
                                        isVisible: { list: false, show: false, edit: false },
                                    },
                                },

                                actions: {
                                    show: {
                                        after: async (response) => {
                                            const record = response.record;
                                            if (!record?.params?.id) return response;
                                            const user = await prisma.user.findUnique({
                                                where: { id: record.params.id as string },
                                                include: {
                                                    role: true,
                                                    politicsGroups: true,
                                                    likedNodes: { include: { node: true } },
                                                },
                                            });
                                            if (!user) return response;
                                            // Вариант 1: виртуальные строки (надёжнее всего)
                                            record.params.roleNames = user.role.map((r) => r.name).join(', ') || '—';
                                            record.params.politicsGroupNames = user.politicsGroups.map((g) => g.name).join(', ') || '—';
                                            record.params.likedNodeNames = user.likedNodes.map((ln) => ln.node.name).join(', ') || '—';
                                            return response;
                                        },
                                    },
                                },
                            },
                        },
                        {
                            resource: { model: getModelByName('Group'), client: prisma },
                            options: {},
                        },
                        {
                          resource: { model: getModelByName('NodeAccess'), client: prisma },
                          options: {
                            listProperties: ['id', 'group', 'node', 'permissions', 'createdAt'],
                            showProperties: ['id', 'group', 'node', 'permissions', 'createdAt', 'updatedAt'],
                            newProperties: ['group', 'node', 'permissions'],
                            editProperties: ['group', 'node', 'permissions'],
                            properties: {
                              group: {
                                label: 'Группа',
                                isVisible: { list: true, show: true, edit: true, new: true, filter: false },
                              },
                              node: {
                                label: 'Узел',
                                isVisible: { list: true, show: true, edit: true, new: true, filter: false },
                              },
                              groupId: {
                                isVisible: { list: false, show: true, edit: false, new: false, filter: false },
                              },
                              nodeId: {
                                isVisible: { list: false, show: true, edit: false, new: false, filter: false },
                              },
                              permissions: {
                                isArray: true,
                                availableValues: [
                                  { value: 'READ', label: 'READ' },
                                  { value: 'WRITE', label: 'WRITE' },
                                  { value: 'DELETE', label: 'DELETE' },
                                  { value: 'ADMIN', label: 'ADMIN' },
                                ],
                                isVisible: { list: true, show: true, edit: true, new: true, filter: false },
                              },
                            },
                          },
                        },
                        {
                            resource: { model: getModelByName('Role'), client: prisma },
                            options: {},
                        },
                        {
                            resource: { model: getModelByName('Permission'), client: prisma },
                            options: {},
                        },
                        {
                            resource: { model: getModelByName('RefreshToken'), client: prisma },
                            options: {},
                        },
                        {
                            resource: { model: getModelByName('Node'), client: prisma },
                            options: {},
                        },
                        {
                            resource: { model: getModelByName('DocumentVersion'), client: prisma },
                            options: {},
                        },
                        {
                            resource: { model: getModelByName('MediaFile'), client: prisma },
                            options: {},
                        },
                        {
                            resource: { model: getModelByName('LikedNode'), client: prisma },
                            options: {},
                        },
                    ],
                },
                auth: {
                    authenticate,
                    cookieName: 'adminjs',
                    cookiePassword: process.env.ADMINJS_COOKIE_SECRET ?? 'dev-secret-change-me',
                },
                sessionOptions: {
                    resave: false,
                    saveUninitialized: false,
                    secret: process.env.ADMINJS_SESSION_SECRET ?? 'dev-session-secret',
                },
            };
        },
    }),
);
