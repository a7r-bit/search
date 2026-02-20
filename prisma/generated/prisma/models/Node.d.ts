import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type NodeModel = runtime.Types.Result.DefaultSelection<Prisma.$NodePayload>;
export type AggregateNode = {
    _count: NodeCountAggregateOutputType | null;
    _min: NodeMinAggregateOutputType | null;
    _max: NodeMaxAggregateOutputType | null;
};
export type NodeMinAggregateOutputType = {
    id: string | null;
    type: $Enums.NodeType | null;
    parentId: string | null;
    name: string | null;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type NodeMaxAggregateOutputType = {
    id: string | null;
    type: $Enums.NodeType | null;
    parentId: string | null;
    name: string | null;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type NodeCountAggregateOutputType = {
    id: number;
    type: number;
    parentId: number;
    name: number;
    description: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type NodeMinAggregateInputType = {
    id?: true;
    type?: true;
    parentId?: true;
    name?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type NodeMaxAggregateInputType = {
    id?: true;
    type?: true;
    parentId?: true;
    name?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type NodeCountAggregateInputType = {
    id?: true;
    type?: true;
    parentId?: true;
    name?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type NodeAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NodeWhereInput;
    orderBy?: Prisma.NodeOrderByWithRelationInput | Prisma.NodeOrderByWithRelationInput[];
    cursor?: Prisma.NodeWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | NodeCountAggregateInputType;
    _min?: NodeMinAggregateInputType;
    _max?: NodeMaxAggregateInputType;
};
export type GetNodeAggregateType<T extends NodeAggregateArgs> = {
    [P in keyof T & keyof AggregateNode]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateNode[P]> : Prisma.GetScalarType<T[P], AggregateNode[P]>;
};
export type NodeGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NodeWhereInput;
    orderBy?: Prisma.NodeOrderByWithAggregationInput | Prisma.NodeOrderByWithAggregationInput[];
    by: Prisma.NodeScalarFieldEnum[] | Prisma.NodeScalarFieldEnum;
    having?: Prisma.NodeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: NodeCountAggregateInputType | true;
    _min?: NodeMinAggregateInputType;
    _max?: NodeMaxAggregateInputType;
};
export type NodeGroupByOutputType = {
    id: string;
    type: $Enums.NodeType;
    parentId: string | null;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: NodeCountAggregateOutputType | null;
    _min: NodeMinAggregateOutputType | null;
    _max: NodeMaxAggregateOutputType | null;
};
type GetNodeGroupByPayload<T extends NodeGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<NodeGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof NodeGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], NodeGroupByOutputType[P]> : Prisma.GetScalarType<T[P], NodeGroupByOutputType[P]>;
}>>;
export type NodeWhereInput = {
    AND?: Prisma.NodeWhereInput | Prisma.NodeWhereInput[];
    OR?: Prisma.NodeWhereInput[];
    NOT?: Prisma.NodeWhereInput | Prisma.NodeWhereInput[];
    id?: Prisma.UuidFilter<"Node"> | string;
    type?: Prisma.EnumNodeTypeFilter<"Node"> | $Enums.NodeType;
    parentId?: Prisma.UuidNullableFilter<"Node"> | string | null;
    name?: Prisma.StringFilter<"Node"> | string;
    description?: Prisma.StringNullableFilter<"Node"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Node"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Node"> | Date | string;
    parent?: Prisma.XOR<Prisma.NodeNullableScalarRelationFilter, Prisma.NodeWhereInput> | null;
    children?: Prisma.NodeListRelationFilter;
    documentVersions?: Prisma.DocumentVersionListRelationFilter;
    likedBy?: Prisma.LikedNodeListRelationFilter;
};
export type NodeOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    parentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    parent?: Prisma.NodeOrderByWithRelationInput;
    children?: Prisma.NodeOrderByRelationAggregateInput;
    documentVersions?: Prisma.DocumentVersionOrderByRelationAggregateInput;
    likedBy?: Prisma.LikedNodeOrderByRelationAggregateInput;
};
export type NodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    parentId_name_type?: Prisma.NodeParentIdNameTypeCompoundUniqueInput;
    AND?: Prisma.NodeWhereInput | Prisma.NodeWhereInput[];
    OR?: Prisma.NodeWhereInput[];
    NOT?: Prisma.NodeWhereInput | Prisma.NodeWhereInput[];
    type?: Prisma.EnumNodeTypeFilter<"Node"> | $Enums.NodeType;
    parentId?: Prisma.UuidNullableFilter<"Node"> | string | null;
    name?: Prisma.StringFilter<"Node"> | string;
    description?: Prisma.StringNullableFilter<"Node"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Node"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Node"> | Date | string;
    parent?: Prisma.XOR<Prisma.NodeNullableScalarRelationFilter, Prisma.NodeWhereInput> | null;
    children?: Prisma.NodeListRelationFilter;
    documentVersions?: Prisma.DocumentVersionListRelationFilter;
    likedBy?: Prisma.LikedNodeListRelationFilter;
}, "id" | "parentId_name_type">;
export type NodeOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    parentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.NodeCountOrderByAggregateInput;
    _max?: Prisma.NodeMaxOrderByAggregateInput;
    _min?: Prisma.NodeMinOrderByAggregateInput;
};
export type NodeScalarWhereWithAggregatesInput = {
    AND?: Prisma.NodeScalarWhereWithAggregatesInput | Prisma.NodeScalarWhereWithAggregatesInput[];
    OR?: Prisma.NodeScalarWhereWithAggregatesInput[];
    NOT?: Prisma.NodeScalarWhereWithAggregatesInput | Prisma.NodeScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Node"> | string;
    type?: Prisma.EnumNodeTypeWithAggregatesFilter<"Node"> | $Enums.NodeType;
    parentId?: Prisma.UuidNullableWithAggregatesFilter<"Node"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"Node"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Node"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Node"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Node"> | Date | string;
};
export type NodeCreateInput = {
    id?: string;
    type: $Enums.NodeType;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    parent?: Prisma.NodeCreateNestedOneWithoutChildrenInput;
    children?: Prisma.NodeCreateNestedManyWithoutParentInput;
    documentVersions?: Prisma.DocumentVersionCreateNestedManyWithoutNodeInput;
    likedBy?: Prisma.LikedNodeCreateNestedManyWithoutNodeInput;
};
export type NodeUncheckedCreateInput = {
    id?: string;
    type: $Enums.NodeType;
    parentId?: string | null;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: Prisma.NodeUncheckedCreateNestedManyWithoutParentInput;
    documentVersions?: Prisma.DocumentVersionUncheckedCreateNestedManyWithoutNodeInput;
    likedBy?: Prisma.LikedNodeUncheckedCreateNestedManyWithoutNodeInput;
};
export type NodeUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    parent?: Prisma.NodeUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.NodeUpdateManyWithoutParentNestedInput;
    documentVersions?: Prisma.DocumentVersionUpdateManyWithoutNodeNestedInput;
    likedBy?: Prisma.LikedNodeUpdateManyWithoutNodeNestedInput;
};
export type NodeUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    children?: Prisma.NodeUncheckedUpdateManyWithoutParentNestedInput;
    documentVersions?: Prisma.DocumentVersionUncheckedUpdateManyWithoutNodeNestedInput;
    likedBy?: Prisma.LikedNodeUncheckedUpdateManyWithoutNodeNestedInput;
};
export type NodeCreateManyInput = {
    id?: string;
    type: $Enums.NodeType;
    parentId?: string | null;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type NodeUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NodeUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NodeNullableScalarRelationFilter = {
    is?: Prisma.NodeWhereInput | null;
    isNot?: Prisma.NodeWhereInput | null;
};
export type NodeListRelationFilter = {
    every?: Prisma.NodeWhereInput;
    some?: Prisma.NodeWhereInput;
    none?: Prisma.NodeWhereInput;
};
export type NodeOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type NodeParentIdNameTypeCompoundUniqueInput = {
    parentId: string;
    name: string;
    type: $Enums.NodeType;
};
export type NodeCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    parentId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type NodeMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    parentId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type NodeMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    parentId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type NodeScalarRelationFilter = {
    is?: Prisma.NodeWhereInput;
    isNot?: Prisma.NodeWhereInput;
};
export type NodeCreateNestedOneWithoutChildrenInput = {
    create?: Prisma.XOR<Prisma.NodeCreateWithoutChildrenInput, Prisma.NodeUncheckedCreateWithoutChildrenInput>;
    connectOrCreate?: Prisma.NodeCreateOrConnectWithoutChildrenInput;
    connect?: Prisma.NodeWhereUniqueInput;
};
export type NodeCreateNestedManyWithoutParentInput = {
    create?: Prisma.XOR<Prisma.NodeCreateWithoutParentInput, Prisma.NodeUncheckedCreateWithoutParentInput> | Prisma.NodeCreateWithoutParentInput[] | Prisma.NodeUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.NodeCreateOrConnectWithoutParentInput | Prisma.NodeCreateOrConnectWithoutParentInput[];
    createMany?: Prisma.NodeCreateManyParentInputEnvelope;
    connect?: Prisma.NodeWhereUniqueInput | Prisma.NodeWhereUniqueInput[];
};
export type NodeUncheckedCreateNestedManyWithoutParentInput = {
    create?: Prisma.XOR<Prisma.NodeCreateWithoutParentInput, Prisma.NodeUncheckedCreateWithoutParentInput> | Prisma.NodeCreateWithoutParentInput[] | Prisma.NodeUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.NodeCreateOrConnectWithoutParentInput | Prisma.NodeCreateOrConnectWithoutParentInput[];
    createMany?: Prisma.NodeCreateManyParentInputEnvelope;
    connect?: Prisma.NodeWhereUniqueInput | Prisma.NodeWhereUniqueInput[];
};
export type EnumNodeTypeFieldUpdateOperationsInput = {
    set?: $Enums.NodeType;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type NodeUpdateOneWithoutChildrenNestedInput = {
    create?: Prisma.XOR<Prisma.NodeCreateWithoutChildrenInput, Prisma.NodeUncheckedCreateWithoutChildrenInput>;
    connectOrCreate?: Prisma.NodeCreateOrConnectWithoutChildrenInput;
    upsert?: Prisma.NodeUpsertWithoutChildrenInput;
    disconnect?: Prisma.NodeWhereInput | boolean;
    delete?: Prisma.NodeWhereInput | boolean;
    connect?: Prisma.NodeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.NodeUpdateToOneWithWhereWithoutChildrenInput, Prisma.NodeUpdateWithoutChildrenInput>, Prisma.NodeUncheckedUpdateWithoutChildrenInput>;
};
export type NodeUpdateManyWithoutParentNestedInput = {
    create?: Prisma.XOR<Prisma.NodeCreateWithoutParentInput, Prisma.NodeUncheckedCreateWithoutParentInput> | Prisma.NodeCreateWithoutParentInput[] | Prisma.NodeUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.NodeCreateOrConnectWithoutParentInput | Prisma.NodeCreateOrConnectWithoutParentInput[];
    upsert?: Prisma.NodeUpsertWithWhereUniqueWithoutParentInput | Prisma.NodeUpsertWithWhereUniqueWithoutParentInput[];
    createMany?: Prisma.NodeCreateManyParentInputEnvelope;
    set?: Prisma.NodeWhereUniqueInput | Prisma.NodeWhereUniqueInput[];
    disconnect?: Prisma.NodeWhereUniqueInput | Prisma.NodeWhereUniqueInput[];
    delete?: Prisma.NodeWhereUniqueInput | Prisma.NodeWhereUniqueInput[];
    connect?: Prisma.NodeWhereUniqueInput | Prisma.NodeWhereUniqueInput[];
    update?: Prisma.NodeUpdateWithWhereUniqueWithoutParentInput | Prisma.NodeUpdateWithWhereUniqueWithoutParentInput[];
    updateMany?: Prisma.NodeUpdateManyWithWhereWithoutParentInput | Prisma.NodeUpdateManyWithWhereWithoutParentInput[];
    deleteMany?: Prisma.NodeScalarWhereInput | Prisma.NodeScalarWhereInput[];
};
export type NodeUncheckedUpdateManyWithoutParentNestedInput = {
    create?: Prisma.XOR<Prisma.NodeCreateWithoutParentInput, Prisma.NodeUncheckedCreateWithoutParentInput> | Prisma.NodeCreateWithoutParentInput[] | Prisma.NodeUncheckedCreateWithoutParentInput[];
    connectOrCreate?: Prisma.NodeCreateOrConnectWithoutParentInput | Prisma.NodeCreateOrConnectWithoutParentInput[];
    upsert?: Prisma.NodeUpsertWithWhereUniqueWithoutParentInput | Prisma.NodeUpsertWithWhereUniqueWithoutParentInput[];
    createMany?: Prisma.NodeCreateManyParentInputEnvelope;
    set?: Prisma.NodeWhereUniqueInput | Prisma.NodeWhereUniqueInput[];
    disconnect?: Prisma.NodeWhereUniqueInput | Prisma.NodeWhereUniqueInput[];
    delete?: Prisma.NodeWhereUniqueInput | Prisma.NodeWhereUniqueInput[];
    connect?: Prisma.NodeWhereUniqueInput | Prisma.NodeWhereUniqueInput[];
    update?: Prisma.NodeUpdateWithWhereUniqueWithoutParentInput | Prisma.NodeUpdateWithWhereUniqueWithoutParentInput[];
    updateMany?: Prisma.NodeUpdateManyWithWhereWithoutParentInput | Prisma.NodeUpdateManyWithWhereWithoutParentInput[];
    deleteMany?: Prisma.NodeScalarWhereInput | Prisma.NodeScalarWhereInput[];
};
export type NodeCreateNestedOneWithoutDocumentVersionsInput = {
    create?: Prisma.XOR<Prisma.NodeCreateWithoutDocumentVersionsInput, Prisma.NodeUncheckedCreateWithoutDocumentVersionsInput>;
    connectOrCreate?: Prisma.NodeCreateOrConnectWithoutDocumentVersionsInput;
    connect?: Prisma.NodeWhereUniqueInput;
};
export type NodeUpdateOneRequiredWithoutDocumentVersionsNestedInput = {
    create?: Prisma.XOR<Prisma.NodeCreateWithoutDocumentVersionsInput, Prisma.NodeUncheckedCreateWithoutDocumentVersionsInput>;
    connectOrCreate?: Prisma.NodeCreateOrConnectWithoutDocumentVersionsInput;
    upsert?: Prisma.NodeUpsertWithoutDocumentVersionsInput;
    connect?: Prisma.NodeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.NodeUpdateToOneWithWhereWithoutDocumentVersionsInput, Prisma.NodeUpdateWithoutDocumentVersionsInput>, Prisma.NodeUncheckedUpdateWithoutDocumentVersionsInput>;
};
export type NodeCreateNestedOneWithoutLikedByInput = {
    create?: Prisma.XOR<Prisma.NodeCreateWithoutLikedByInput, Prisma.NodeUncheckedCreateWithoutLikedByInput>;
    connectOrCreate?: Prisma.NodeCreateOrConnectWithoutLikedByInput;
    connect?: Prisma.NodeWhereUniqueInput;
};
export type NodeUpdateOneRequiredWithoutLikedByNestedInput = {
    create?: Prisma.XOR<Prisma.NodeCreateWithoutLikedByInput, Prisma.NodeUncheckedCreateWithoutLikedByInput>;
    connectOrCreate?: Prisma.NodeCreateOrConnectWithoutLikedByInput;
    upsert?: Prisma.NodeUpsertWithoutLikedByInput;
    connect?: Prisma.NodeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.NodeUpdateToOneWithWhereWithoutLikedByInput, Prisma.NodeUpdateWithoutLikedByInput>, Prisma.NodeUncheckedUpdateWithoutLikedByInput>;
};
export type NodeCreateWithoutChildrenInput = {
    id?: string;
    type: $Enums.NodeType;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    parent?: Prisma.NodeCreateNestedOneWithoutChildrenInput;
    documentVersions?: Prisma.DocumentVersionCreateNestedManyWithoutNodeInput;
    likedBy?: Prisma.LikedNodeCreateNestedManyWithoutNodeInput;
};
export type NodeUncheckedCreateWithoutChildrenInput = {
    id?: string;
    type: $Enums.NodeType;
    parentId?: string | null;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    documentVersions?: Prisma.DocumentVersionUncheckedCreateNestedManyWithoutNodeInput;
    likedBy?: Prisma.LikedNodeUncheckedCreateNestedManyWithoutNodeInput;
};
export type NodeCreateOrConnectWithoutChildrenInput = {
    where: Prisma.NodeWhereUniqueInput;
    create: Prisma.XOR<Prisma.NodeCreateWithoutChildrenInput, Prisma.NodeUncheckedCreateWithoutChildrenInput>;
};
export type NodeCreateWithoutParentInput = {
    id?: string;
    type: $Enums.NodeType;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: Prisma.NodeCreateNestedManyWithoutParentInput;
    documentVersions?: Prisma.DocumentVersionCreateNestedManyWithoutNodeInput;
    likedBy?: Prisma.LikedNodeCreateNestedManyWithoutNodeInput;
};
export type NodeUncheckedCreateWithoutParentInput = {
    id?: string;
    type: $Enums.NodeType;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: Prisma.NodeUncheckedCreateNestedManyWithoutParentInput;
    documentVersions?: Prisma.DocumentVersionUncheckedCreateNestedManyWithoutNodeInput;
    likedBy?: Prisma.LikedNodeUncheckedCreateNestedManyWithoutNodeInput;
};
export type NodeCreateOrConnectWithoutParentInput = {
    where: Prisma.NodeWhereUniqueInput;
    create: Prisma.XOR<Prisma.NodeCreateWithoutParentInput, Prisma.NodeUncheckedCreateWithoutParentInput>;
};
export type NodeCreateManyParentInputEnvelope = {
    data: Prisma.NodeCreateManyParentInput | Prisma.NodeCreateManyParentInput[];
    skipDuplicates?: boolean;
};
export type NodeUpsertWithoutChildrenInput = {
    update: Prisma.XOR<Prisma.NodeUpdateWithoutChildrenInput, Prisma.NodeUncheckedUpdateWithoutChildrenInput>;
    create: Prisma.XOR<Prisma.NodeCreateWithoutChildrenInput, Prisma.NodeUncheckedCreateWithoutChildrenInput>;
    where?: Prisma.NodeWhereInput;
};
export type NodeUpdateToOneWithWhereWithoutChildrenInput = {
    where?: Prisma.NodeWhereInput;
    data: Prisma.XOR<Prisma.NodeUpdateWithoutChildrenInput, Prisma.NodeUncheckedUpdateWithoutChildrenInput>;
};
export type NodeUpdateWithoutChildrenInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    parent?: Prisma.NodeUpdateOneWithoutChildrenNestedInput;
    documentVersions?: Prisma.DocumentVersionUpdateManyWithoutNodeNestedInput;
    likedBy?: Prisma.LikedNodeUpdateManyWithoutNodeNestedInput;
};
export type NodeUncheckedUpdateWithoutChildrenInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    documentVersions?: Prisma.DocumentVersionUncheckedUpdateManyWithoutNodeNestedInput;
    likedBy?: Prisma.LikedNodeUncheckedUpdateManyWithoutNodeNestedInput;
};
export type NodeUpsertWithWhereUniqueWithoutParentInput = {
    where: Prisma.NodeWhereUniqueInput;
    update: Prisma.XOR<Prisma.NodeUpdateWithoutParentInput, Prisma.NodeUncheckedUpdateWithoutParentInput>;
    create: Prisma.XOR<Prisma.NodeCreateWithoutParentInput, Prisma.NodeUncheckedCreateWithoutParentInput>;
};
export type NodeUpdateWithWhereUniqueWithoutParentInput = {
    where: Prisma.NodeWhereUniqueInput;
    data: Prisma.XOR<Prisma.NodeUpdateWithoutParentInput, Prisma.NodeUncheckedUpdateWithoutParentInput>;
};
export type NodeUpdateManyWithWhereWithoutParentInput = {
    where: Prisma.NodeScalarWhereInput;
    data: Prisma.XOR<Prisma.NodeUpdateManyMutationInput, Prisma.NodeUncheckedUpdateManyWithoutParentInput>;
};
export type NodeScalarWhereInput = {
    AND?: Prisma.NodeScalarWhereInput | Prisma.NodeScalarWhereInput[];
    OR?: Prisma.NodeScalarWhereInput[];
    NOT?: Prisma.NodeScalarWhereInput | Prisma.NodeScalarWhereInput[];
    id?: Prisma.UuidFilter<"Node"> | string;
    type?: Prisma.EnumNodeTypeFilter<"Node"> | $Enums.NodeType;
    parentId?: Prisma.UuidNullableFilter<"Node"> | string | null;
    name?: Prisma.StringFilter<"Node"> | string;
    description?: Prisma.StringNullableFilter<"Node"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Node"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Node"> | Date | string;
};
export type NodeCreateWithoutDocumentVersionsInput = {
    id?: string;
    type: $Enums.NodeType;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    parent?: Prisma.NodeCreateNestedOneWithoutChildrenInput;
    children?: Prisma.NodeCreateNestedManyWithoutParentInput;
    likedBy?: Prisma.LikedNodeCreateNestedManyWithoutNodeInput;
};
export type NodeUncheckedCreateWithoutDocumentVersionsInput = {
    id?: string;
    type: $Enums.NodeType;
    parentId?: string | null;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: Prisma.NodeUncheckedCreateNestedManyWithoutParentInput;
    likedBy?: Prisma.LikedNodeUncheckedCreateNestedManyWithoutNodeInput;
};
export type NodeCreateOrConnectWithoutDocumentVersionsInput = {
    where: Prisma.NodeWhereUniqueInput;
    create: Prisma.XOR<Prisma.NodeCreateWithoutDocumentVersionsInput, Prisma.NodeUncheckedCreateWithoutDocumentVersionsInput>;
};
export type NodeUpsertWithoutDocumentVersionsInput = {
    update: Prisma.XOR<Prisma.NodeUpdateWithoutDocumentVersionsInput, Prisma.NodeUncheckedUpdateWithoutDocumentVersionsInput>;
    create: Prisma.XOR<Prisma.NodeCreateWithoutDocumentVersionsInput, Prisma.NodeUncheckedCreateWithoutDocumentVersionsInput>;
    where?: Prisma.NodeWhereInput;
};
export type NodeUpdateToOneWithWhereWithoutDocumentVersionsInput = {
    where?: Prisma.NodeWhereInput;
    data: Prisma.XOR<Prisma.NodeUpdateWithoutDocumentVersionsInput, Prisma.NodeUncheckedUpdateWithoutDocumentVersionsInput>;
};
export type NodeUpdateWithoutDocumentVersionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    parent?: Prisma.NodeUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.NodeUpdateManyWithoutParentNestedInput;
    likedBy?: Prisma.LikedNodeUpdateManyWithoutNodeNestedInput;
};
export type NodeUncheckedUpdateWithoutDocumentVersionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    children?: Prisma.NodeUncheckedUpdateManyWithoutParentNestedInput;
    likedBy?: Prisma.LikedNodeUncheckedUpdateManyWithoutNodeNestedInput;
};
export type NodeCreateWithoutLikedByInput = {
    id?: string;
    type: $Enums.NodeType;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    parent?: Prisma.NodeCreateNestedOneWithoutChildrenInput;
    children?: Prisma.NodeCreateNestedManyWithoutParentInput;
    documentVersions?: Prisma.DocumentVersionCreateNestedManyWithoutNodeInput;
};
export type NodeUncheckedCreateWithoutLikedByInput = {
    id?: string;
    type: $Enums.NodeType;
    parentId?: string | null;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    children?: Prisma.NodeUncheckedCreateNestedManyWithoutParentInput;
    documentVersions?: Prisma.DocumentVersionUncheckedCreateNestedManyWithoutNodeInput;
};
export type NodeCreateOrConnectWithoutLikedByInput = {
    where: Prisma.NodeWhereUniqueInput;
    create: Prisma.XOR<Prisma.NodeCreateWithoutLikedByInput, Prisma.NodeUncheckedCreateWithoutLikedByInput>;
};
export type NodeUpsertWithoutLikedByInput = {
    update: Prisma.XOR<Prisma.NodeUpdateWithoutLikedByInput, Prisma.NodeUncheckedUpdateWithoutLikedByInput>;
    create: Prisma.XOR<Prisma.NodeCreateWithoutLikedByInput, Prisma.NodeUncheckedCreateWithoutLikedByInput>;
    where?: Prisma.NodeWhereInput;
};
export type NodeUpdateToOneWithWhereWithoutLikedByInput = {
    where?: Prisma.NodeWhereInput;
    data: Prisma.XOR<Prisma.NodeUpdateWithoutLikedByInput, Prisma.NodeUncheckedUpdateWithoutLikedByInput>;
};
export type NodeUpdateWithoutLikedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    parent?: Prisma.NodeUpdateOneWithoutChildrenNestedInput;
    children?: Prisma.NodeUpdateManyWithoutParentNestedInput;
    documentVersions?: Prisma.DocumentVersionUpdateManyWithoutNodeNestedInput;
};
export type NodeUncheckedUpdateWithoutLikedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    parentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    children?: Prisma.NodeUncheckedUpdateManyWithoutParentNestedInput;
    documentVersions?: Prisma.DocumentVersionUncheckedUpdateManyWithoutNodeNestedInput;
};
export type NodeCreateManyParentInput = {
    id?: string;
    type: $Enums.NodeType;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type NodeUpdateWithoutParentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    children?: Prisma.NodeUpdateManyWithoutParentNestedInput;
    documentVersions?: Prisma.DocumentVersionUpdateManyWithoutNodeNestedInput;
    likedBy?: Prisma.LikedNodeUpdateManyWithoutNodeNestedInput;
};
export type NodeUncheckedUpdateWithoutParentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    children?: Prisma.NodeUncheckedUpdateManyWithoutParentNestedInput;
    documentVersions?: Prisma.DocumentVersionUncheckedUpdateManyWithoutNodeNestedInput;
    likedBy?: Prisma.LikedNodeUncheckedUpdateManyWithoutNodeNestedInput;
};
export type NodeUncheckedUpdateManyWithoutParentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumNodeTypeFieldUpdateOperationsInput | $Enums.NodeType;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type NodeCountOutputType = {
    children: number;
    documentVersions: number;
    likedBy: number;
};
export type NodeCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    children?: boolean | NodeCountOutputTypeCountChildrenArgs;
    documentVersions?: boolean | NodeCountOutputTypeCountDocumentVersionsArgs;
    likedBy?: boolean | NodeCountOutputTypeCountLikedByArgs;
};
export type NodeCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeCountOutputTypeSelect<ExtArgs> | null;
};
export type NodeCountOutputTypeCountChildrenArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NodeWhereInput;
};
export type NodeCountOutputTypeCountDocumentVersionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocumentVersionWhereInput;
};
export type NodeCountOutputTypeCountLikedByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LikedNodeWhereInput;
};
export type NodeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    type?: boolean;
    parentId?: boolean;
    name?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    parent?: boolean | Prisma.Node$parentArgs<ExtArgs>;
    children?: boolean | Prisma.Node$childrenArgs<ExtArgs>;
    documentVersions?: boolean | Prisma.Node$documentVersionsArgs<ExtArgs>;
    likedBy?: boolean | Prisma.Node$likedByArgs<ExtArgs>;
    _count?: boolean | Prisma.NodeCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["node"]>;
export type NodeSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    type?: boolean;
    parentId?: boolean;
    name?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    parent?: boolean | Prisma.Node$parentArgs<ExtArgs>;
}, ExtArgs["result"]["node"]>;
export type NodeSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    type?: boolean;
    parentId?: boolean;
    name?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    parent?: boolean | Prisma.Node$parentArgs<ExtArgs>;
}, ExtArgs["result"]["node"]>;
export type NodeSelectScalar = {
    id?: boolean;
    type?: boolean;
    parentId?: boolean;
    name?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type NodeOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "type" | "parentId" | "name" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["node"]>;
export type NodeInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    parent?: boolean | Prisma.Node$parentArgs<ExtArgs>;
    children?: boolean | Prisma.Node$childrenArgs<ExtArgs>;
    documentVersions?: boolean | Prisma.Node$documentVersionsArgs<ExtArgs>;
    likedBy?: boolean | Prisma.Node$likedByArgs<ExtArgs>;
    _count?: boolean | Prisma.NodeCountOutputTypeDefaultArgs<ExtArgs>;
};
export type NodeIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    parent?: boolean | Prisma.Node$parentArgs<ExtArgs>;
};
export type NodeIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    parent?: boolean | Prisma.Node$parentArgs<ExtArgs>;
};
export type $NodePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Node";
    objects: {
        parent: Prisma.$NodePayload<ExtArgs> | null;
        children: Prisma.$NodePayload<ExtArgs>[];
        documentVersions: Prisma.$DocumentVersionPayload<ExtArgs>[];
        likedBy: Prisma.$LikedNodePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        type: $Enums.NodeType;
        parentId: string | null;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["node"]>;
    composites: {};
};
export type NodeGetPayload<S extends boolean | null | undefined | NodeDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$NodePayload, S>;
export type NodeCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<NodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: NodeCountAggregateInputType | true;
};
export interface NodeDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Node'];
        meta: {
            name: 'Node';
        };
    };
    findUnique<T extends NodeFindUniqueArgs>(args: Prisma.SelectSubset<T, NodeFindUniqueArgs<ExtArgs>>): Prisma.Prisma__NodeClient<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends NodeFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, NodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__NodeClient<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends NodeFindFirstArgs>(args?: Prisma.SelectSubset<T, NodeFindFirstArgs<ExtArgs>>): Prisma.Prisma__NodeClient<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends NodeFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, NodeFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__NodeClient<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends NodeFindManyArgs>(args?: Prisma.SelectSubset<T, NodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends NodeCreateArgs>(args: Prisma.SelectSubset<T, NodeCreateArgs<ExtArgs>>): Prisma.Prisma__NodeClient<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends NodeCreateManyArgs>(args?: Prisma.SelectSubset<T, NodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends NodeCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, NodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends NodeDeleteArgs>(args: Prisma.SelectSubset<T, NodeDeleteArgs<ExtArgs>>): Prisma.Prisma__NodeClient<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends NodeUpdateArgs>(args: Prisma.SelectSubset<T, NodeUpdateArgs<ExtArgs>>): Prisma.Prisma__NodeClient<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends NodeDeleteManyArgs>(args?: Prisma.SelectSubset<T, NodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends NodeUpdateManyArgs>(args: Prisma.SelectSubset<T, NodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends NodeUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, NodeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends NodeUpsertArgs>(args: Prisma.SelectSubset<T, NodeUpsertArgs<ExtArgs>>): Prisma.Prisma__NodeClient<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends NodeCountArgs>(args?: Prisma.Subset<T, NodeCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], NodeCountAggregateOutputType> : number>;
    aggregate<T extends NodeAggregateArgs>(args: Prisma.Subset<T, NodeAggregateArgs>): Prisma.PrismaPromise<GetNodeAggregateType<T>>;
    groupBy<T extends NodeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: NodeGroupByArgs['orderBy'];
    } : {
        orderBy?: NodeGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, NodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: NodeFieldRefs;
}
export interface Prisma__NodeClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    parent<T extends Prisma.Node$parentArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Node$parentArgs<ExtArgs>>): Prisma.Prisma__NodeClient<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    children<T extends Prisma.Node$childrenArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Node$childrenArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    documentVersions<T extends Prisma.Node$documentVersionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Node$documentVersionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocumentVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    likedBy<T extends Prisma.Node$likedByArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Node$likedByArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LikedNodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface NodeFieldRefs {
    readonly id: Prisma.FieldRef<"Node", 'String'>;
    readonly type: Prisma.FieldRef<"Node", 'NodeType'>;
    readonly parentId: Prisma.FieldRef<"Node", 'String'>;
    readonly name: Prisma.FieldRef<"Node", 'String'>;
    readonly description: Prisma.FieldRef<"Node", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Node", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Node", 'DateTime'>;
}
export type NodeFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeSelect<ExtArgs> | null;
    omit?: Prisma.NodeOmit<ExtArgs> | null;
    include?: Prisma.NodeInclude<ExtArgs> | null;
    where: Prisma.NodeWhereUniqueInput;
};
export type NodeFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeSelect<ExtArgs> | null;
    omit?: Prisma.NodeOmit<ExtArgs> | null;
    include?: Prisma.NodeInclude<ExtArgs> | null;
    where: Prisma.NodeWhereUniqueInput;
};
export type NodeFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeSelect<ExtArgs> | null;
    omit?: Prisma.NodeOmit<ExtArgs> | null;
    include?: Prisma.NodeInclude<ExtArgs> | null;
    where?: Prisma.NodeWhereInput;
    orderBy?: Prisma.NodeOrderByWithRelationInput | Prisma.NodeOrderByWithRelationInput[];
    cursor?: Prisma.NodeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NodeScalarFieldEnum | Prisma.NodeScalarFieldEnum[];
};
export type NodeFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeSelect<ExtArgs> | null;
    omit?: Prisma.NodeOmit<ExtArgs> | null;
    include?: Prisma.NodeInclude<ExtArgs> | null;
    where?: Prisma.NodeWhereInput;
    orderBy?: Prisma.NodeOrderByWithRelationInput | Prisma.NodeOrderByWithRelationInput[];
    cursor?: Prisma.NodeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NodeScalarFieldEnum | Prisma.NodeScalarFieldEnum[];
};
export type NodeFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeSelect<ExtArgs> | null;
    omit?: Prisma.NodeOmit<ExtArgs> | null;
    include?: Prisma.NodeInclude<ExtArgs> | null;
    where?: Prisma.NodeWhereInput;
    orderBy?: Prisma.NodeOrderByWithRelationInput | Prisma.NodeOrderByWithRelationInput[];
    cursor?: Prisma.NodeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NodeScalarFieldEnum | Prisma.NodeScalarFieldEnum[];
};
export type NodeCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeSelect<ExtArgs> | null;
    omit?: Prisma.NodeOmit<ExtArgs> | null;
    include?: Prisma.NodeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.NodeCreateInput, Prisma.NodeUncheckedCreateInput>;
};
export type NodeCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.NodeCreateManyInput | Prisma.NodeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type NodeCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.NodeOmit<ExtArgs> | null;
    data: Prisma.NodeCreateManyInput | Prisma.NodeCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.NodeIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type NodeUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeSelect<ExtArgs> | null;
    omit?: Prisma.NodeOmit<ExtArgs> | null;
    include?: Prisma.NodeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.NodeUpdateInput, Prisma.NodeUncheckedUpdateInput>;
    where: Prisma.NodeWhereUniqueInput;
};
export type NodeUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.NodeUpdateManyMutationInput, Prisma.NodeUncheckedUpdateManyInput>;
    where?: Prisma.NodeWhereInput;
    limit?: number;
};
export type NodeUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.NodeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.NodeUpdateManyMutationInput, Prisma.NodeUncheckedUpdateManyInput>;
    where?: Prisma.NodeWhereInput;
    limit?: number;
    include?: Prisma.NodeIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type NodeUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeSelect<ExtArgs> | null;
    omit?: Prisma.NodeOmit<ExtArgs> | null;
    include?: Prisma.NodeInclude<ExtArgs> | null;
    where: Prisma.NodeWhereUniqueInput;
    create: Prisma.XOR<Prisma.NodeCreateInput, Prisma.NodeUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.NodeUpdateInput, Prisma.NodeUncheckedUpdateInput>;
};
export type NodeDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeSelect<ExtArgs> | null;
    omit?: Prisma.NodeOmit<ExtArgs> | null;
    include?: Prisma.NodeInclude<ExtArgs> | null;
    where: Prisma.NodeWhereUniqueInput;
};
export type NodeDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.NodeWhereInput;
    limit?: number;
};
export type Node$parentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeSelect<ExtArgs> | null;
    omit?: Prisma.NodeOmit<ExtArgs> | null;
    include?: Prisma.NodeInclude<ExtArgs> | null;
    where?: Prisma.NodeWhereInput;
};
export type Node$childrenArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeSelect<ExtArgs> | null;
    omit?: Prisma.NodeOmit<ExtArgs> | null;
    include?: Prisma.NodeInclude<ExtArgs> | null;
    where?: Prisma.NodeWhereInput;
    orderBy?: Prisma.NodeOrderByWithRelationInput | Prisma.NodeOrderByWithRelationInput[];
    cursor?: Prisma.NodeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.NodeScalarFieldEnum | Prisma.NodeScalarFieldEnum[];
};
export type Node$documentVersionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocumentVersionOmit<ExtArgs> | null;
    include?: Prisma.DocumentVersionInclude<ExtArgs> | null;
    where?: Prisma.DocumentVersionWhereInput;
    orderBy?: Prisma.DocumentVersionOrderByWithRelationInput | Prisma.DocumentVersionOrderByWithRelationInput[];
    cursor?: Prisma.DocumentVersionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocumentVersionScalarFieldEnum | Prisma.DocumentVersionScalarFieldEnum[];
};
export type Node$likedByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type NodeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.NodeSelect<ExtArgs> | null;
    omit?: Prisma.NodeOmit<ExtArgs> | null;
    include?: Prisma.NodeInclude<ExtArgs> | null;
};
export {};
