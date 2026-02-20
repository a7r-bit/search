import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type LikedNodeModel = runtime.Types.Result.DefaultSelection<Prisma.$LikedNodePayload>;
export type AggregateLikedNode = {
    _count: LikedNodeCountAggregateOutputType | null;
    _min: LikedNodeMinAggregateOutputType | null;
    _max: LikedNodeMaxAggregateOutputType | null;
};
export type LikedNodeMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    nodeId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LikedNodeMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    nodeId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LikedNodeCountAggregateOutputType = {
    id: number;
    userId: number;
    nodeId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type LikedNodeMinAggregateInputType = {
    id?: true;
    userId?: true;
    nodeId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LikedNodeMaxAggregateInputType = {
    id?: true;
    userId?: true;
    nodeId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LikedNodeCountAggregateInputType = {
    id?: true;
    userId?: true;
    nodeId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type LikedNodeAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LikedNodeWhereInput;
    orderBy?: Prisma.LikedNodeOrderByWithRelationInput | Prisma.LikedNodeOrderByWithRelationInput[];
    cursor?: Prisma.LikedNodeWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LikedNodeCountAggregateInputType;
    _min?: LikedNodeMinAggregateInputType;
    _max?: LikedNodeMaxAggregateInputType;
};
export type GetLikedNodeAggregateType<T extends LikedNodeAggregateArgs> = {
    [P in keyof T & keyof AggregateLikedNode]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLikedNode[P]> : Prisma.GetScalarType<T[P], AggregateLikedNode[P]>;
};
export type LikedNodeGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LikedNodeWhereInput;
    orderBy?: Prisma.LikedNodeOrderByWithAggregationInput | Prisma.LikedNodeOrderByWithAggregationInput[];
    by: Prisma.LikedNodeScalarFieldEnum[] | Prisma.LikedNodeScalarFieldEnum;
    having?: Prisma.LikedNodeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LikedNodeCountAggregateInputType | true;
    _min?: LikedNodeMinAggregateInputType;
    _max?: LikedNodeMaxAggregateInputType;
};
export type LikedNodeGroupByOutputType = {
    id: string;
    userId: string;
    nodeId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: LikedNodeCountAggregateOutputType | null;
    _min: LikedNodeMinAggregateOutputType | null;
    _max: LikedNodeMaxAggregateOutputType | null;
};
type GetLikedNodeGroupByPayload<T extends LikedNodeGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LikedNodeGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LikedNodeGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LikedNodeGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LikedNodeGroupByOutputType[P]>;
}>>;
export type LikedNodeWhereInput = {
    AND?: Prisma.LikedNodeWhereInput | Prisma.LikedNodeWhereInput[];
    OR?: Prisma.LikedNodeWhereInput[];
    NOT?: Prisma.LikedNodeWhereInput | Prisma.LikedNodeWhereInput[];
    id?: Prisma.UuidFilter<"LikedNode"> | string;
    userId?: Prisma.UuidFilter<"LikedNode"> | string;
    nodeId?: Prisma.UuidFilter<"LikedNode"> | string;
    createdAt?: Prisma.DateTimeFilter<"LikedNode"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LikedNode"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    node?: Prisma.XOR<Prisma.NodeScalarRelationFilter, Prisma.NodeWhereInput>;
};
export type LikedNodeOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    nodeId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    node?: Prisma.NodeOrderByWithRelationInput;
};
export type LikedNodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_nodeId?: Prisma.LikedNodeUserIdNodeIdCompoundUniqueInput;
    AND?: Prisma.LikedNodeWhereInput | Prisma.LikedNodeWhereInput[];
    OR?: Prisma.LikedNodeWhereInput[];
    NOT?: Prisma.LikedNodeWhereInput | Prisma.LikedNodeWhereInput[];
    userId?: Prisma.UuidFilter<"LikedNode"> | string;
    nodeId?: Prisma.UuidFilter<"LikedNode"> | string;
    createdAt?: Prisma.DateTimeFilter<"LikedNode"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LikedNode"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    node?: Prisma.XOR<Prisma.NodeScalarRelationFilter, Prisma.NodeWhereInput>;
}, "id" | "userId_nodeId">;
export type LikedNodeOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    nodeId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.LikedNodeCountOrderByAggregateInput;
    _max?: Prisma.LikedNodeMaxOrderByAggregateInput;
    _min?: Prisma.LikedNodeMinOrderByAggregateInput;
};
export type LikedNodeScalarWhereWithAggregatesInput = {
    AND?: Prisma.LikedNodeScalarWhereWithAggregatesInput | Prisma.LikedNodeScalarWhereWithAggregatesInput[];
    OR?: Prisma.LikedNodeScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LikedNodeScalarWhereWithAggregatesInput | Prisma.LikedNodeScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"LikedNode"> | string;
    userId?: Prisma.UuidWithAggregatesFilter<"LikedNode"> | string;
    nodeId?: Prisma.UuidWithAggregatesFilter<"LikedNode"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"LikedNode"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"LikedNode"> | Date | string;
};
export type LikedNodeCreateInput = {
    id?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutLikedNodesInput;
    node: Prisma.NodeCreateNestedOneWithoutLikedByInput;
};
export type LikedNodeUncheckedCreateInput = {
    id?: string;
    userId: string;
    nodeId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LikedNodeUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutLikedNodesNestedInput;
    node?: Prisma.NodeUpdateOneRequiredWithoutLikedByNestedInput;
};
export type LikedNodeUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    nodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LikedNodeCreateManyInput = {
    id?: string;
    userId: string;
    nodeId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LikedNodeUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LikedNodeUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    nodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LikedNodeListRelationFilter = {
    every?: Prisma.LikedNodeWhereInput;
    some?: Prisma.LikedNodeWhereInput;
    none?: Prisma.LikedNodeWhereInput;
};
export type LikedNodeOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type LikedNodeUserIdNodeIdCompoundUniqueInput = {
    userId: string;
    nodeId: string;
};
export type LikedNodeCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    nodeId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LikedNodeMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    nodeId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LikedNodeMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    nodeId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LikedNodeCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.LikedNodeCreateWithoutUserInput, Prisma.LikedNodeUncheckedCreateWithoutUserInput> | Prisma.LikedNodeCreateWithoutUserInput[] | Prisma.LikedNodeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.LikedNodeCreateOrConnectWithoutUserInput | Prisma.LikedNodeCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.LikedNodeCreateManyUserInputEnvelope;
    connect?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
};
export type LikedNodeUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.LikedNodeCreateWithoutUserInput, Prisma.LikedNodeUncheckedCreateWithoutUserInput> | Prisma.LikedNodeCreateWithoutUserInput[] | Prisma.LikedNodeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.LikedNodeCreateOrConnectWithoutUserInput | Prisma.LikedNodeCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.LikedNodeCreateManyUserInputEnvelope;
    connect?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
};
export type LikedNodeUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.LikedNodeCreateWithoutUserInput, Prisma.LikedNodeUncheckedCreateWithoutUserInput> | Prisma.LikedNodeCreateWithoutUserInput[] | Prisma.LikedNodeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.LikedNodeCreateOrConnectWithoutUserInput | Prisma.LikedNodeCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.LikedNodeUpsertWithWhereUniqueWithoutUserInput | Prisma.LikedNodeUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.LikedNodeCreateManyUserInputEnvelope;
    set?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
    disconnect?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
    delete?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
    connect?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
    update?: Prisma.LikedNodeUpdateWithWhereUniqueWithoutUserInput | Prisma.LikedNodeUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.LikedNodeUpdateManyWithWhereWithoutUserInput | Prisma.LikedNodeUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.LikedNodeScalarWhereInput | Prisma.LikedNodeScalarWhereInput[];
};
export type LikedNodeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.LikedNodeCreateWithoutUserInput, Prisma.LikedNodeUncheckedCreateWithoutUserInput> | Prisma.LikedNodeCreateWithoutUserInput[] | Prisma.LikedNodeUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.LikedNodeCreateOrConnectWithoutUserInput | Prisma.LikedNodeCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.LikedNodeUpsertWithWhereUniqueWithoutUserInput | Prisma.LikedNodeUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.LikedNodeCreateManyUserInputEnvelope;
    set?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
    disconnect?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
    delete?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
    connect?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
    update?: Prisma.LikedNodeUpdateWithWhereUniqueWithoutUserInput | Prisma.LikedNodeUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.LikedNodeUpdateManyWithWhereWithoutUserInput | Prisma.LikedNodeUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.LikedNodeScalarWhereInput | Prisma.LikedNodeScalarWhereInput[];
};
export type LikedNodeCreateNestedManyWithoutNodeInput = {
    create?: Prisma.XOR<Prisma.LikedNodeCreateWithoutNodeInput, Prisma.LikedNodeUncheckedCreateWithoutNodeInput> | Prisma.LikedNodeCreateWithoutNodeInput[] | Prisma.LikedNodeUncheckedCreateWithoutNodeInput[];
    connectOrCreate?: Prisma.LikedNodeCreateOrConnectWithoutNodeInput | Prisma.LikedNodeCreateOrConnectWithoutNodeInput[];
    createMany?: Prisma.LikedNodeCreateManyNodeInputEnvelope;
    connect?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
};
export type LikedNodeUncheckedCreateNestedManyWithoutNodeInput = {
    create?: Prisma.XOR<Prisma.LikedNodeCreateWithoutNodeInput, Prisma.LikedNodeUncheckedCreateWithoutNodeInput> | Prisma.LikedNodeCreateWithoutNodeInput[] | Prisma.LikedNodeUncheckedCreateWithoutNodeInput[];
    connectOrCreate?: Prisma.LikedNodeCreateOrConnectWithoutNodeInput | Prisma.LikedNodeCreateOrConnectWithoutNodeInput[];
    createMany?: Prisma.LikedNodeCreateManyNodeInputEnvelope;
    connect?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
};
export type LikedNodeUpdateManyWithoutNodeNestedInput = {
    create?: Prisma.XOR<Prisma.LikedNodeCreateWithoutNodeInput, Prisma.LikedNodeUncheckedCreateWithoutNodeInput> | Prisma.LikedNodeCreateWithoutNodeInput[] | Prisma.LikedNodeUncheckedCreateWithoutNodeInput[];
    connectOrCreate?: Prisma.LikedNodeCreateOrConnectWithoutNodeInput | Prisma.LikedNodeCreateOrConnectWithoutNodeInput[];
    upsert?: Prisma.LikedNodeUpsertWithWhereUniqueWithoutNodeInput | Prisma.LikedNodeUpsertWithWhereUniqueWithoutNodeInput[];
    createMany?: Prisma.LikedNodeCreateManyNodeInputEnvelope;
    set?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
    disconnect?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
    delete?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
    connect?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
    update?: Prisma.LikedNodeUpdateWithWhereUniqueWithoutNodeInput | Prisma.LikedNodeUpdateWithWhereUniqueWithoutNodeInput[];
    updateMany?: Prisma.LikedNodeUpdateManyWithWhereWithoutNodeInput | Prisma.LikedNodeUpdateManyWithWhereWithoutNodeInput[];
    deleteMany?: Prisma.LikedNodeScalarWhereInput | Prisma.LikedNodeScalarWhereInput[];
};
export type LikedNodeUncheckedUpdateManyWithoutNodeNestedInput = {
    create?: Prisma.XOR<Prisma.LikedNodeCreateWithoutNodeInput, Prisma.LikedNodeUncheckedCreateWithoutNodeInput> | Prisma.LikedNodeCreateWithoutNodeInput[] | Prisma.LikedNodeUncheckedCreateWithoutNodeInput[];
    connectOrCreate?: Prisma.LikedNodeCreateOrConnectWithoutNodeInput | Prisma.LikedNodeCreateOrConnectWithoutNodeInput[];
    upsert?: Prisma.LikedNodeUpsertWithWhereUniqueWithoutNodeInput | Prisma.LikedNodeUpsertWithWhereUniqueWithoutNodeInput[];
    createMany?: Prisma.LikedNodeCreateManyNodeInputEnvelope;
    set?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
    disconnect?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
    delete?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
    connect?: Prisma.LikedNodeWhereUniqueInput | Prisma.LikedNodeWhereUniqueInput[];
    update?: Prisma.LikedNodeUpdateWithWhereUniqueWithoutNodeInput | Prisma.LikedNodeUpdateWithWhereUniqueWithoutNodeInput[];
    updateMany?: Prisma.LikedNodeUpdateManyWithWhereWithoutNodeInput | Prisma.LikedNodeUpdateManyWithWhereWithoutNodeInput[];
    deleteMany?: Prisma.LikedNodeScalarWhereInput | Prisma.LikedNodeScalarWhereInput[];
};
export type LikedNodeCreateWithoutUserInput = {
    id?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    node: Prisma.NodeCreateNestedOneWithoutLikedByInput;
};
export type LikedNodeUncheckedCreateWithoutUserInput = {
    id?: string;
    nodeId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LikedNodeCreateOrConnectWithoutUserInput = {
    where: Prisma.LikedNodeWhereUniqueInput;
    create: Prisma.XOR<Prisma.LikedNodeCreateWithoutUserInput, Prisma.LikedNodeUncheckedCreateWithoutUserInput>;
};
export type LikedNodeCreateManyUserInputEnvelope = {
    data: Prisma.LikedNodeCreateManyUserInput | Prisma.LikedNodeCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type LikedNodeUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.LikedNodeWhereUniqueInput;
    update: Prisma.XOR<Prisma.LikedNodeUpdateWithoutUserInput, Prisma.LikedNodeUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.LikedNodeCreateWithoutUserInput, Prisma.LikedNodeUncheckedCreateWithoutUserInput>;
};
export type LikedNodeUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.LikedNodeWhereUniqueInput;
    data: Prisma.XOR<Prisma.LikedNodeUpdateWithoutUserInput, Prisma.LikedNodeUncheckedUpdateWithoutUserInput>;
};
export type LikedNodeUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.LikedNodeScalarWhereInput;
    data: Prisma.XOR<Prisma.LikedNodeUpdateManyMutationInput, Prisma.LikedNodeUncheckedUpdateManyWithoutUserInput>;
};
export type LikedNodeScalarWhereInput = {
    AND?: Prisma.LikedNodeScalarWhereInput | Prisma.LikedNodeScalarWhereInput[];
    OR?: Prisma.LikedNodeScalarWhereInput[];
    NOT?: Prisma.LikedNodeScalarWhereInput | Prisma.LikedNodeScalarWhereInput[];
    id?: Prisma.UuidFilter<"LikedNode"> | string;
    userId?: Prisma.UuidFilter<"LikedNode"> | string;
    nodeId?: Prisma.UuidFilter<"LikedNode"> | string;
    createdAt?: Prisma.DateTimeFilter<"LikedNode"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LikedNode"> | Date | string;
};
export type LikedNodeCreateWithoutNodeInput = {
    id?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutLikedNodesInput;
};
export type LikedNodeUncheckedCreateWithoutNodeInput = {
    id?: string;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LikedNodeCreateOrConnectWithoutNodeInput = {
    where: Prisma.LikedNodeWhereUniqueInput;
    create: Prisma.XOR<Prisma.LikedNodeCreateWithoutNodeInput, Prisma.LikedNodeUncheckedCreateWithoutNodeInput>;
};
export type LikedNodeCreateManyNodeInputEnvelope = {
    data: Prisma.LikedNodeCreateManyNodeInput | Prisma.LikedNodeCreateManyNodeInput[];
    skipDuplicates?: boolean;
};
export type LikedNodeUpsertWithWhereUniqueWithoutNodeInput = {
    where: Prisma.LikedNodeWhereUniqueInput;
    update: Prisma.XOR<Prisma.LikedNodeUpdateWithoutNodeInput, Prisma.LikedNodeUncheckedUpdateWithoutNodeInput>;
    create: Prisma.XOR<Prisma.LikedNodeCreateWithoutNodeInput, Prisma.LikedNodeUncheckedCreateWithoutNodeInput>;
};
export type LikedNodeUpdateWithWhereUniqueWithoutNodeInput = {
    where: Prisma.LikedNodeWhereUniqueInput;
    data: Prisma.XOR<Prisma.LikedNodeUpdateWithoutNodeInput, Prisma.LikedNodeUncheckedUpdateWithoutNodeInput>;
};
export type LikedNodeUpdateManyWithWhereWithoutNodeInput = {
    where: Prisma.LikedNodeScalarWhereInput;
    data: Prisma.XOR<Prisma.LikedNodeUpdateManyMutationInput, Prisma.LikedNodeUncheckedUpdateManyWithoutNodeInput>;
};
export type LikedNodeCreateManyUserInput = {
    id?: string;
    nodeId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LikedNodeUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    node?: Prisma.NodeUpdateOneRequiredWithoutLikedByNestedInput;
};
export type LikedNodeUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LikedNodeUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    nodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LikedNodeCreateManyNodeInput = {
    id?: string;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LikedNodeUpdateWithoutNodeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutLikedNodesNestedInput;
};
export type LikedNodeUncheckedUpdateWithoutNodeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LikedNodeUncheckedUpdateManyWithoutNodeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LikedNodeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    nodeId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    node?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["likedNode"]>;
export type LikedNodeSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    nodeId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    node?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["likedNode"]>;
export type LikedNodeSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    nodeId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    node?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["likedNode"]>;
export type LikedNodeSelectScalar = {
    id?: boolean;
    userId?: boolean;
    nodeId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type LikedNodeOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "nodeId" | "createdAt" | "updatedAt", ExtArgs["result"]["likedNode"]>;
export type LikedNodeInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    node?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
};
export type LikedNodeIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    node?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
};
export type LikedNodeIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    node?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
};
export type $LikedNodePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LikedNode";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        node: Prisma.$NodePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        nodeId: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["likedNode"]>;
    composites: {};
};
export type LikedNodeGetPayload<S extends boolean | null | undefined | LikedNodeDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LikedNodePayload, S>;
export type LikedNodeCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LikedNodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LikedNodeCountAggregateInputType | true;
};
export interface LikedNodeDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LikedNode'];
        meta: {
            name: 'LikedNode';
        };
    };
    findUnique<T extends LikedNodeFindUniqueArgs>(args: Prisma.SelectSubset<T, LikedNodeFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LikedNodeClient<runtime.Types.Result.GetResult<Prisma.$LikedNodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LikedNodeFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LikedNodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LikedNodeClient<runtime.Types.Result.GetResult<Prisma.$LikedNodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LikedNodeFindFirstArgs>(args?: Prisma.SelectSubset<T, LikedNodeFindFirstArgs<ExtArgs>>): Prisma.Prisma__LikedNodeClient<runtime.Types.Result.GetResult<Prisma.$LikedNodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LikedNodeFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LikedNodeFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LikedNodeClient<runtime.Types.Result.GetResult<Prisma.$LikedNodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LikedNodeFindManyArgs>(args?: Prisma.SelectSubset<T, LikedNodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LikedNodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LikedNodeCreateArgs>(args: Prisma.SelectSubset<T, LikedNodeCreateArgs<ExtArgs>>): Prisma.Prisma__LikedNodeClient<runtime.Types.Result.GetResult<Prisma.$LikedNodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LikedNodeCreateManyArgs>(args?: Prisma.SelectSubset<T, LikedNodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LikedNodeCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LikedNodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LikedNodePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LikedNodeDeleteArgs>(args: Prisma.SelectSubset<T, LikedNodeDeleteArgs<ExtArgs>>): Prisma.Prisma__LikedNodeClient<runtime.Types.Result.GetResult<Prisma.$LikedNodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LikedNodeUpdateArgs>(args: Prisma.SelectSubset<T, LikedNodeUpdateArgs<ExtArgs>>): Prisma.Prisma__LikedNodeClient<runtime.Types.Result.GetResult<Prisma.$LikedNodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LikedNodeDeleteManyArgs>(args?: Prisma.SelectSubset<T, LikedNodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LikedNodeUpdateManyArgs>(args: Prisma.SelectSubset<T, LikedNodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LikedNodeUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LikedNodeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LikedNodePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LikedNodeUpsertArgs>(args: Prisma.SelectSubset<T, LikedNodeUpsertArgs<ExtArgs>>): Prisma.Prisma__LikedNodeClient<runtime.Types.Result.GetResult<Prisma.$LikedNodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LikedNodeCountArgs>(args?: Prisma.Subset<T, LikedNodeCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LikedNodeCountAggregateOutputType> : number>;
    aggregate<T extends LikedNodeAggregateArgs>(args: Prisma.Subset<T, LikedNodeAggregateArgs>): Prisma.PrismaPromise<GetLikedNodeAggregateType<T>>;
    groupBy<T extends LikedNodeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LikedNodeGroupByArgs['orderBy'];
    } : {
        orderBy?: LikedNodeGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LikedNodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLikedNodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LikedNodeFieldRefs;
}
export interface Prisma__LikedNodeClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    node<T extends Prisma.NodeDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.NodeDefaultArgs<ExtArgs>>): Prisma.Prisma__NodeClient<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LikedNodeFieldRefs {
    readonly id: Prisma.FieldRef<"LikedNode", 'String'>;
    readonly userId: Prisma.FieldRef<"LikedNode", 'String'>;
    readonly nodeId: Prisma.FieldRef<"LikedNode", 'String'>;
    readonly createdAt: Prisma.FieldRef<"LikedNode", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"LikedNode", 'DateTime'>;
}
export type LikedNodeFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LikedNodeSelect<ExtArgs> | null;
    omit?: Prisma.LikedNodeOmit<ExtArgs> | null;
    include?: Prisma.LikedNodeInclude<ExtArgs> | null;
    where: Prisma.LikedNodeWhereUniqueInput;
};
export type LikedNodeFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LikedNodeSelect<ExtArgs> | null;
    omit?: Prisma.LikedNodeOmit<ExtArgs> | null;
    include?: Prisma.LikedNodeInclude<ExtArgs> | null;
    where: Prisma.LikedNodeWhereUniqueInput;
};
export type LikedNodeFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LikedNodeSelect<ExtArgs> | null;
    omit?: Prisma.LikedNodeOmit<ExtArgs> | null;
    include?: Prisma.LikedNodeInclude<ExtArgs> | null;
    where?: Prisma.LikedNodeWhereInput;
    orderBy?: Prisma.LikedNodeOrderByWithRelationInput | Prisma.LikedNodeOrderByWithRelationInput[];
    cursor?: Prisma.LikedNodeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LikedNodeScalarFieldEnum | Prisma.LikedNodeScalarFieldEnum[];
};
export type LikedNodeFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LikedNodeSelect<ExtArgs> | null;
    omit?: Prisma.LikedNodeOmit<ExtArgs> | null;
    include?: Prisma.LikedNodeInclude<ExtArgs> | null;
    where?: Prisma.LikedNodeWhereInput;
    orderBy?: Prisma.LikedNodeOrderByWithRelationInput | Prisma.LikedNodeOrderByWithRelationInput[];
    cursor?: Prisma.LikedNodeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LikedNodeScalarFieldEnum | Prisma.LikedNodeScalarFieldEnum[];
};
export type LikedNodeFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LikedNodeSelect<ExtArgs> | null;
    omit?: Prisma.LikedNodeOmit<ExtArgs> | null;
    include?: Prisma.LikedNodeInclude<ExtArgs> | null;
    where?: Prisma.LikedNodeWhereInput;
    orderBy?: Prisma.LikedNodeOrderByWithRelationInput | Prisma.LikedNodeOrderByWithRelationInput[];
    cursor?: Prisma.LikedNodeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LikedNodeScalarFieldEnum | Prisma.LikedNodeScalarFieldEnum[];
};
export type LikedNodeCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LikedNodeSelect<ExtArgs> | null;
    omit?: Prisma.LikedNodeOmit<ExtArgs> | null;
    include?: Prisma.LikedNodeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LikedNodeCreateInput, Prisma.LikedNodeUncheckedCreateInput>;
};
export type LikedNodeCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LikedNodeCreateManyInput | Prisma.LikedNodeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LikedNodeCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LikedNodeSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LikedNodeOmit<ExtArgs> | null;
    data: Prisma.LikedNodeCreateManyInput | Prisma.LikedNodeCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.LikedNodeIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type LikedNodeUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LikedNodeSelect<ExtArgs> | null;
    omit?: Prisma.LikedNodeOmit<ExtArgs> | null;
    include?: Prisma.LikedNodeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LikedNodeUpdateInput, Prisma.LikedNodeUncheckedUpdateInput>;
    where: Prisma.LikedNodeWhereUniqueInput;
};
export type LikedNodeUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LikedNodeUpdateManyMutationInput, Prisma.LikedNodeUncheckedUpdateManyInput>;
    where?: Prisma.LikedNodeWhereInput;
    limit?: number;
};
export type LikedNodeUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LikedNodeSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LikedNodeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LikedNodeUpdateManyMutationInput, Prisma.LikedNodeUncheckedUpdateManyInput>;
    where?: Prisma.LikedNodeWhereInput;
    limit?: number;
    include?: Prisma.LikedNodeIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type LikedNodeUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LikedNodeSelect<ExtArgs> | null;
    omit?: Prisma.LikedNodeOmit<ExtArgs> | null;
    include?: Prisma.LikedNodeInclude<ExtArgs> | null;
    where: Prisma.LikedNodeWhereUniqueInput;
    create: Prisma.XOR<Prisma.LikedNodeCreateInput, Prisma.LikedNodeUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LikedNodeUpdateInput, Prisma.LikedNodeUncheckedUpdateInput>;
};
export type LikedNodeDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LikedNodeSelect<ExtArgs> | null;
    omit?: Prisma.LikedNodeOmit<ExtArgs> | null;
    include?: Prisma.LikedNodeInclude<ExtArgs> | null;
    where: Prisma.LikedNodeWhereUniqueInput;
};
export type LikedNodeDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LikedNodeWhereInput;
    limit?: number;
};
export type LikedNodeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LikedNodeSelect<ExtArgs> | null;
    omit?: Prisma.LikedNodeOmit<ExtArgs> | null;
    include?: Prisma.LikedNodeInclude<ExtArgs> | null;
};
export {};
