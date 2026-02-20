import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type DocumentVersionModel = runtime.Types.Result.DefaultSelection<Prisma.$DocumentVersionPayload>;
export type AggregateDocumentVersion = {
    _count: DocumentVersionCountAggregateOutputType | null;
    _avg: DocumentVersionAvgAggregateOutputType | null;
    _sum: DocumentVersionSumAggregateOutputType | null;
    _min: DocumentVersionMinAggregateOutputType | null;
    _max: DocumentVersionMaxAggregateOutputType | null;
};
export type DocumentVersionAvgAggregateOutputType = {
    version: number | null;
};
export type DocumentVersionSumAggregateOutputType = {
    version: number | null;
};
export type DocumentVersionMinAggregateOutputType = {
    id: string | null;
    version: number | null;
    nodeId: string | null;
    conversionStatus: $Enums.ConversionStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DocumentVersionMaxAggregateOutputType = {
    id: string | null;
    version: number | null;
    nodeId: string | null;
    conversionStatus: $Enums.ConversionStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DocumentVersionCountAggregateOutputType = {
    id: number;
    version: number;
    nodeId: number;
    conversionStatus: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type DocumentVersionAvgAggregateInputType = {
    version?: true;
};
export type DocumentVersionSumAggregateInputType = {
    version?: true;
};
export type DocumentVersionMinAggregateInputType = {
    id?: true;
    version?: true;
    nodeId?: true;
    conversionStatus?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DocumentVersionMaxAggregateInputType = {
    id?: true;
    version?: true;
    nodeId?: true;
    conversionStatus?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DocumentVersionCountAggregateInputType = {
    id?: true;
    version?: true;
    nodeId?: true;
    conversionStatus?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type DocumentVersionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocumentVersionWhereInput;
    orderBy?: Prisma.DocumentVersionOrderByWithRelationInput | Prisma.DocumentVersionOrderByWithRelationInput[];
    cursor?: Prisma.DocumentVersionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DocumentVersionCountAggregateInputType;
    _avg?: DocumentVersionAvgAggregateInputType;
    _sum?: DocumentVersionSumAggregateInputType;
    _min?: DocumentVersionMinAggregateInputType;
    _max?: DocumentVersionMaxAggregateInputType;
};
export type GetDocumentVersionAggregateType<T extends DocumentVersionAggregateArgs> = {
    [P in keyof T & keyof AggregateDocumentVersion]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDocumentVersion[P]> : Prisma.GetScalarType<T[P], AggregateDocumentVersion[P]>;
};
export type DocumentVersionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocumentVersionWhereInput;
    orderBy?: Prisma.DocumentVersionOrderByWithAggregationInput | Prisma.DocumentVersionOrderByWithAggregationInput[];
    by: Prisma.DocumentVersionScalarFieldEnum[] | Prisma.DocumentVersionScalarFieldEnum;
    having?: Prisma.DocumentVersionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DocumentVersionCountAggregateInputType | true;
    _avg?: DocumentVersionAvgAggregateInputType;
    _sum?: DocumentVersionSumAggregateInputType;
    _min?: DocumentVersionMinAggregateInputType;
    _max?: DocumentVersionMaxAggregateInputType;
};
export type DocumentVersionGroupByOutputType = {
    id: string;
    version: number;
    nodeId: string;
    conversionStatus: $Enums.ConversionStatus;
    createdAt: Date;
    updatedAt: Date;
    _count: DocumentVersionCountAggregateOutputType | null;
    _avg: DocumentVersionAvgAggregateOutputType | null;
    _sum: DocumentVersionSumAggregateOutputType | null;
    _min: DocumentVersionMinAggregateOutputType | null;
    _max: DocumentVersionMaxAggregateOutputType | null;
};
type GetDocumentVersionGroupByPayload<T extends DocumentVersionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DocumentVersionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DocumentVersionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DocumentVersionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DocumentVersionGroupByOutputType[P]>;
}>>;
export type DocumentVersionWhereInput = {
    AND?: Prisma.DocumentVersionWhereInput | Prisma.DocumentVersionWhereInput[];
    OR?: Prisma.DocumentVersionWhereInput[];
    NOT?: Prisma.DocumentVersionWhereInput | Prisma.DocumentVersionWhereInput[];
    id?: Prisma.UuidFilter<"DocumentVersion"> | string;
    version?: Prisma.IntFilter<"DocumentVersion"> | number;
    nodeId?: Prisma.UuidFilter<"DocumentVersion"> | string;
    conversionStatus?: Prisma.EnumConversionStatusFilter<"DocumentVersion"> | $Enums.ConversionStatus;
    createdAt?: Prisma.DateTimeFilter<"DocumentVersion"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"DocumentVersion"> | Date | string;
    node?: Prisma.XOR<Prisma.NodeScalarRelationFilter, Prisma.NodeWhereInput>;
    mediaFile?: Prisma.XOR<Prisma.MediaFileNullableScalarRelationFilter, Prisma.MediaFileWhereInput> | null;
};
export type DocumentVersionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    nodeId?: Prisma.SortOrder;
    conversionStatus?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    node?: Prisma.NodeOrderByWithRelationInput;
    mediaFile?: Prisma.MediaFileOrderByWithRelationInput;
};
export type DocumentVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    version_nodeId?: Prisma.DocumentVersionVersionNodeIdCompoundUniqueInput;
    AND?: Prisma.DocumentVersionWhereInput | Prisma.DocumentVersionWhereInput[];
    OR?: Prisma.DocumentVersionWhereInput[];
    NOT?: Prisma.DocumentVersionWhereInput | Prisma.DocumentVersionWhereInput[];
    version?: Prisma.IntFilter<"DocumentVersion"> | number;
    nodeId?: Prisma.UuidFilter<"DocumentVersion"> | string;
    conversionStatus?: Prisma.EnumConversionStatusFilter<"DocumentVersion"> | $Enums.ConversionStatus;
    createdAt?: Prisma.DateTimeFilter<"DocumentVersion"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"DocumentVersion"> | Date | string;
    node?: Prisma.XOR<Prisma.NodeScalarRelationFilter, Prisma.NodeWhereInput>;
    mediaFile?: Prisma.XOR<Prisma.MediaFileNullableScalarRelationFilter, Prisma.MediaFileWhereInput> | null;
}, "id" | "version_nodeId">;
export type DocumentVersionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    nodeId?: Prisma.SortOrder;
    conversionStatus?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.DocumentVersionCountOrderByAggregateInput;
    _avg?: Prisma.DocumentVersionAvgOrderByAggregateInput;
    _max?: Prisma.DocumentVersionMaxOrderByAggregateInput;
    _min?: Prisma.DocumentVersionMinOrderByAggregateInput;
    _sum?: Prisma.DocumentVersionSumOrderByAggregateInput;
};
export type DocumentVersionScalarWhereWithAggregatesInput = {
    AND?: Prisma.DocumentVersionScalarWhereWithAggregatesInput | Prisma.DocumentVersionScalarWhereWithAggregatesInput[];
    OR?: Prisma.DocumentVersionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DocumentVersionScalarWhereWithAggregatesInput | Prisma.DocumentVersionScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"DocumentVersion"> | string;
    version?: Prisma.IntWithAggregatesFilter<"DocumentVersion"> | number;
    nodeId?: Prisma.UuidWithAggregatesFilter<"DocumentVersion"> | string;
    conversionStatus?: Prisma.EnumConversionStatusWithAggregatesFilter<"DocumentVersion"> | $Enums.ConversionStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"DocumentVersion"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"DocumentVersion"> | Date | string;
};
export type DocumentVersionCreateInput = {
    id?: string;
    version: number;
    conversionStatus?: $Enums.ConversionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    node: Prisma.NodeCreateNestedOneWithoutDocumentVersionsInput;
    mediaFile?: Prisma.MediaFileCreateNestedOneWithoutDocumentVersionInput;
};
export type DocumentVersionUncheckedCreateInput = {
    id?: string;
    version: number;
    nodeId: string;
    conversionStatus?: $Enums.ConversionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    mediaFile?: Prisma.MediaFileUncheckedCreateNestedOneWithoutDocumentVersionInput;
};
export type DocumentVersionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    conversionStatus?: Prisma.EnumConversionStatusFieldUpdateOperationsInput | $Enums.ConversionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    node?: Prisma.NodeUpdateOneRequiredWithoutDocumentVersionsNestedInput;
    mediaFile?: Prisma.MediaFileUpdateOneWithoutDocumentVersionNestedInput;
};
export type DocumentVersionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    nodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    conversionStatus?: Prisma.EnumConversionStatusFieldUpdateOperationsInput | $Enums.ConversionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    mediaFile?: Prisma.MediaFileUncheckedUpdateOneWithoutDocumentVersionNestedInput;
};
export type DocumentVersionCreateManyInput = {
    id?: string;
    version: number;
    nodeId: string;
    conversionStatus?: $Enums.ConversionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DocumentVersionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    conversionStatus?: Prisma.EnumConversionStatusFieldUpdateOperationsInput | $Enums.ConversionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocumentVersionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    nodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    conversionStatus?: Prisma.EnumConversionStatusFieldUpdateOperationsInput | $Enums.ConversionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocumentVersionListRelationFilter = {
    every?: Prisma.DocumentVersionWhereInput;
    some?: Prisma.DocumentVersionWhereInput;
    none?: Prisma.DocumentVersionWhereInput;
};
export type DocumentVersionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DocumentVersionVersionNodeIdCompoundUniqueInput = {
    version: number;
    nodeId: string;
};
export type DocumentVersionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    nodeId?: Prisma.SortOrder;
    conversionStatus?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DocumentVersionAvgOrderByAggregateInput = {
    version?: Prisma.SortOrder;
};
export type DocumentVersionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    nodeId?: Prisma.SortOrder;
    conversionStatus?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DocumentVersionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    nodeId?: Prisma.SortOrder;
    conversionStatus?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DocumentVersionSumOrderByAggregateInput = {
    version?: Prisma.SortOrder;
};
export type DocumentVersionNullableScalarRelationFilter = {
    is?: Prisma.DocumentVersionWhereInput | null;
    isNot?: Prisma.DocumentVersionWhereInput | null;
};
export type DocumentVersionCreateNestedManyWithoutNodeInput = {
    create?: Prisma.XOR<Prisma.DocumentVersionCreateWithoutNodeInput, Prisma.DocumentVersionUncheckedCreateWithoutNodeInput> | Prisma.DocumentVersionCreateWithoutNodeInput[] | Prisma.DocumentVersionUncheckedCreateWithoutNodeInput[];
    connectOrCreate?: Prisma.DocumentVersionCreateOrConnectWithoutNodeInput | Prisma.DocumentVersionCreateOrConnectWithoutNodeInput[];
    createMany?: Prisma.DocumentVersionCreateManyNodeInputEnvelope;
    connect?: Prisma.DocumentVersionWhereUniqueInput | Prisma.DocumentVersionWhereUniqueInput[];
};
export type DocumentVersionUncheckedCreateNestedManyWithoutNodeInput = {
    create?: Prisma.XOR<Prisma.DocumentVersionCreateWithoutNodeInput, Prisma.DocumentVersionUncheckedCreateWithoutNodeInput> | Prisma.DocumentVersionCreateWithoutNodeInput[] | Prisma.DocumentVersionUncheckedCreateWithoutNodeInput[];
    connectOrCreate?: Prisma.DocumentVersionCreateOrConnectWithoutNodeInput | Prisma.DocumentVersionCreateOrConnectWithoutNodeInput[];
    createMany?: Prisma.DocumentVersionCreateManyNodeInputEnvelope;
    connect?: Prisma.DocumentVersionWhereUniqueInput | Prisma.DocumentVersionWhereUniqueInput[];
};
export type DocumentVersionUpdateManyWithoutNodeNestedInput = {
    create?: Prisma.XOR<Prisma.DocumentVersionCreateWithoutNodeInput, Prisma.DocumentVersionUncheckedCreateWithoutNodeInput> | Prisma.DocumentVersionCreateWithoutNodeInput[] | Prisma.DocumentVersionUncheckedCreateWithoutNodeInput[];
    connectOrCreate?: Prisma.DocumentVersionCreateOrConnectWithoutNodeInput | Prisma.DocumentVersionCreateOrConnectWithoutNodeInput[];
    upsert?: Prisma.DocumentVersionUpsertWithWhereUniqueWithoutNodeInput | Prisma.DocumentVersionUpsertWithWhereUniqueWithoutNodeInput[];
    createMany?: Prisma.DocumentVersionCreateManyNodeInputEnvelope;
    set?: Prisma.DocumentVersionWhereUniqueInput | Prisma.DocumentVersionWhereUniqueInput[];
    disconnect?: Prisma.DocumentVersionWhereUniqueInput | Prisma.DocumentVersionWhereUniqueInput[];
    delete?: Prisma.DocumentVersionWhereUniqueInput | Prisma.DocumentVersionWhereUniqueInput[];
    connect?: Prisma.DocumentVersionWhereUniqueInput | Prisma.DocumentVersionWhereUniqueInput[];
    update?: Prisma.DocumentVersionUpdateWithWhereUniqueWithoutNodeInput | Prisma.DocumentVersionUpdateWithWhereUniqueWithoutNodeInput[];
    updateMany?: Prisma.DocumentVersionUpdateManyWithWhereWithoutNodeInput | Prisma.DocumentVersionUpdateManyWithWhereWithoutNodeInput[];
    deleteMany?: Prisma.DocumentVersionScalarWhereInput | Prisma.DocumentVersionScalarWhereInput[];
};
export type DocumentVersionUncheckedUpdateManyWithoutNodeNestedInput = {
    create?: Prisma.XOR<Prisma.DocumentVersionCreateWithoutNodeInput, Prisma.DocumentVersionUncheckedCreateWithoutNodeInput> | Prisma.DocumentVersionCreateWithoutNodeInput[] | Prisma.DocumentVersionUncheckedCreateWithoutNodeInput[];
    connectOrCreate?: Prisma.DocumentVersionCreateOrConnectWithoutNodeInput | Prisma.DocumentVersionCreateOrConnectWithoutNodeInput[];
    upsert?: Prisma.DocumentVersionUpsertWithWhereUniqueWithoutNodeInput | Prisma.DocumentVersionUpsertWithWhereUniqueWithoutNodeInput[];
    createMany?: Prisma.DocumentVersionCreateManyNodeInputEnvelope;
    set?: Prisma.DocumentVersionWhereUniqueInput | Prisma.DocumentVersionWhereUniqueInput[];
    disconnect?: Prisma.DocumentVersionWhereUniqueInput | Prisma.DocumentVersionWhereUniqueInput[];
    delete?: Prisma.DocumentVersionWhereUniqueInput | Prisma.DocumentVersionWhereUniqueInput[];
    connect?: Prisma.DocumentVersionWhereUniqueInput | Prisma.DocumentVersionWhereUniqueInput[];
    update?: Prisma.DocumentVersionUpdateWithWhereUniqueWithoutNodeInput | Prisma.DocumentVersionUpdateWithWhereUniqueWithoutNodeInput[];
    updateMany?: Prisma.DocumentVersionUpdateManyWithWhereWithoutNodeInput | Prisma.DocumentVersionUpdateManyWithWhereWithoutNodeInput[];
    deleteMany?: Prisma.DocumentVersionScalarWhereInput | Prisma.DocumentVersionScalarWhereInput[];
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type EnumConversionStatusFieldUpdateOperationsInput = {
    set?: $Enums.ConversionStatus;
};
export type DocumentVersionCreateNestedOneWithoutMediaFileInput = {
    create?: Prisma.XOR<Prisma.DocumentVersionCreateWithoutMediaFileInput, Prisma.DocumentVersionUncheckedCreateWithoutMediaFileInput>;
    connectOrCreate?: Prisma.DocumentVersionCreateOrConnectWithoutMediaFileInput;
    connect?: Prisma.DocumentVersionWhereUniqueInput;
};
export type DocumentVersionUpdateOneWithoutMediaFileNestedInput = {
    create?: Prisma.XOR<Prisma.DocumentVersionCreateWithoutMediaFileInput, Prisma.DocumentVersionUncheckedCreateWithoutMediaFileInput>;
    connectOrCreate?: Prisma.DocumentVersionCreateOrConnectWithoutMediaFileInput;
    upsert?: Prisma.DocumentVersionUpsertWithoutMediaFileInput;
    disconnect?: Prisma.DocumentVersionWhereInput | boolean;
    delete?: Prisma.DocumentVersionWhereInput | boolean;
    connect?: Prisma.DocumentVersionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DocumentVersionUpdateToOneWithWhereWithoutMediaFileInput, Prisma.DocumentVersionUpdateWithoutMediaFileInput>, Prisma.DocumentVersionUncheckedUpdateWithoutMediaFileInput>;
};
export type DocumentVersionCreateWithoutNodeInput = {
    id?: string;
    version: number;
    conversionStatus?: $Enums.ConversionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    mediaFile?: Prisma.MediaFileCreateNestedOneWithoutDocumentVersionInput;
};
export type DocumentVersionUncheckedCreateWithoutNodeInput = {
    id?: string;
    version: number;
    conversionStatus?: $Enums.ConversionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    mediaFile?: Prisma.MediaFileUncheckedCreateNestedOneWithoutDocumentVersionInput;
};
export type DocumentVersionCreateOrConnectWithoutNodeInput = {
    where: Prisma.DocumentVersionWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocumentVersionCreateWithoutNodeInput, Prisma.DocumentVersionUncheckedCreateWithoutNodeInput>;
};
export type DocumentVersionCreateManyNodeInputEnvelope = {
    data: Prisma.DocumentVersionCreateManyNodeInput | Prisma.DocumentVersionCreateManyNodeInput[];
    skipDuplicates?: boolean;
};
export type DocumentVersionUpsertWithWhereUniqueWithoutNodeInput = {
    where: Prisma.DocumentVersionWhereUniqueInput;
    update: Prisma.XOR<Prisma.DocumentVersionUpdateWithoutNodeInput, Prisma.DocumentVersionUncheckedUpdateWithoutNodeInput>;
    create: Prisma.XOR<Prisma.DocumentVersionCreateWithoutNodeInput, Prisma.DocumentVersionUncheckedCreateWithoutNodeInput>;
};
export type DocumentVersionUpdateWithWhereUniqueWithoutNodeInput = {
    where: Prisma.DocumentVersionWhereUniqueInput;
    data: Prisma.XOR<Prisma.DocumentVersionUpdateWithoutNodeInput, Prisma.DocumentVersionUncheckedUpdateWithoutNodeInput>;
};
export type DocumentVersionUpdateManyWithWhereWithoutNodeInput = {
    where: Prisma.DocumentVersionScalarWhereInput;
    data: Prisma.XOR<Prisma.DocumentVersionUpdateManyMutationInput, Prisma.DocumentVersionUncheckedUpdateManyWithoutNodeInput>;
};
export type DocumentVersionScalarWhereInput = {
    AND?: Prisma.DocumentVersionScalarWhereInput | Prisma.DocumentVersionScalarWhereInput[];
    OR?: Prisma.DocumentVersionScalarWhereInput[];
    NOT?: Prisma.DocumentVersionScalarWhereInput | Prisma.DocumentVersionScalarWhereInput[];
    id?: Prisma.UuidFilter<"DocumentVersion"> | string;
    version?: Prisma.IntFilter<"DocumentVersion"> | number;
    nodeId?: Prisma.UuidFilter<"DocumentVersion"> | string;
    conversionStatus?: Prisma.EnumConversionStatusFilter<"DocumentVersion"> | $Enums.ConversionStatus;
    createdAt?: Prisma.DateTimeFilter<"DocumentVersion"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"DocumentVersion"> | Date | string;
};
export type DocumentVersionCreateWithoutMediaFileInput = {
    id?: string;
    version: number;
    conversionStatus?: $Enums.ConversionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    node: Prisma.NodeCreateNestedOneWithoutDocumentVersionsInput;
};
export type DocumentVersionUncheckedCreateWithoutMediaFileInput = {
    id?: string;
    version: number;
    nodeId: string;
    conversionStatus?: $Enums.ConversionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DocumentVersionCreateOrConnectWithoutMediaFileInput = {
    where: Prisma.DocumentVersionWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocumentVersionCreateWithoutMediaFileInput, Prisma.DocumentVersionUncheckedCreateWithoutMediaFileInput>;
};
export type DocumentVersionUpsertWithoutMediaFileInput = {
    update: Prisma.XOR<Prisma.DocumentVersionUpdateWithoutMediaFileInput, Prisma.DocumentVersionUncheckedUpdateWithoutMediaFileInput>;
    create: Prisma.XOR<Prisma.DocumentVersionCreateWithoutMediaFileInput, Prisma.DocumentVersionUncheckedCreateWithoutMediaFileInput>;
    where?: Prisma.DocumentVersionWhereInput;
};
export type DocumentVersionUpdateToOneWithWhereWithoutMediaFileInput = {
    where?: Prisma.DocumentVersionWhereInput;
    data: Prisma.XOR<Prisma.DocumentVersionUpdateWithoutMediaFileInput, Prisma.DocumentVersionUncheckedUpdateWithoutMediaFileInput>;
};
export type DocumentVersionUpdateWithoutMediaFileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    conversionStatus?: Prisma.EnumConversionStatusFieldUpdateOperationsInput | $Enums.ConversionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    node?: Prisma.NodeUpdateOneRequiredWithoutDocumentVersionsNestedInput;
};
export type DocumentVersionUncheckedUpdateWithoutMediaFileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    nodeId?: Prisma.StringFieldUpdateOperationsInput | string;
    conversionStatus?: Prisma.EnumConversionStatusFieldUpdateOperationsInput | $Enums.ConversionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocumentVersionCreateManyNodeInput = {
    id?: string;
    version: number;
    conversionStatus?: $Enums.ConversionStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DocumentVersionUpdateWithoutNodeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    conversionStatus?: Prisma.EnumConversionStatusFieldUpdateOperationsInput | $Enums.ConversionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    mediaFile?: Prisma.MediaFileUpdateOneWithoutDocumentVersionNestedInput;
};
export type DocumentVersionUncheckedUpdateWithoutNodeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    conversionStatus?: Prisma.EnumConversionStatusFieldUpdateOperationsInput | $Enums.ConversionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    mediaFile?: Prisma.MediaFileUncheckedUpdateOneWithoutDocumentVersionNestedInput;
};
export type DocumentVersionUncheckedUpdateManyWithoutNodeInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    conversionStatus?: Prisma.EnumConversionStatusFieldUpdateOperationsInput | $Enums.ConversionStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DocumentVersionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    version?: boolean;
    nodeId?: boolean;
    conversionStatus?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    node?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
    mediaFile?: boolean | Prisma.DocumentVersion$mediaFileArgs<ExtArgs>;
}, ExtArgs["result"]["documentVersion"]>;
export type DocumentVersionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    version?: boolean;
    nodeId?: boolean;
    conversionStatus?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    node?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["documentVersion"]>;
export type DocumentVersionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    version?: boolean;
    nodeId?: boolean;
    conversionStatus?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    node?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["documentVersion"]>;
export type DocumentVersionSelectScalar = {
    id?: boolean;
    version?: boolean;
    nodeId?: boolean;
    conversionStatus?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type DocumentVersionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "version" | "nodeId" | "conversionStatus" | "createdAt" | "updatedAt", ExtArgs["result"]["documentVersion"]>;
export type DocumentVersionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    node?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
    mediaFile?: boolean | Prisma.DocumentVersion$mediaFileArgs<ExtArgs>;
};
export type DocumentVersionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    node?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
};
export type DocumentVersionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    node?: boolean | Prisma.NodeDefaultArgs<ExtArgs>;
};
export type $DocumentVersionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DocumentVersion";
    objects: {
        node: Prisma.$NodePayload<ExtArgs>;
        mediaFile: Prisma.$MediaFilePayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        version: number;
        nodeId: string;
        conversionStatus: $Enums.ConversionStatus;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["documentVersion"]>;
    composites: {};
};
export type DocumentVersionGetPayload<S extends boolean | null | undefined | DocumentVersionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DocumentVersionPayload, S>;
export type DocumentVersionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DocumentVersionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DocumentVersionCountAggregateInputType | true;
};
export interface DocumentVersionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DocumentVersion'];
        meta: {
            name: 'DocumentVersion';
        };
    };
    findUnique<T extends DocumentVersionFindUniqueArgs>(args: Prisma.SelectSubset<T, DocumentVersionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DocumentVersionClient<runtime.Types.Result.GetResult<Prisma.$DocumentVersionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DocumentVersionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DocumentVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocumentVersionClient<runtime.Types.Result.GetResult<Prisma.$DocumentVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DocumentVersionFindFirstArgs>(args?: Prisma.SelectSubset<T, DocumentVersionFindFirstArgs<ExtArgs>>): Prisma.Prisma__DocumentVersionClient<runtime.Types.Result.GetResult<Prisma.$DocumentVersionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DocumentVersionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DocumentVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DocumentVersionClient<runtime.Types.Result.GetResult<Prisma.$DocumentVersionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DocumentVersionFindManyArgs>(args?: Prisma.SelectSubset<T, DocumentVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocumentVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DocumentVersionCreateArgs>(args: Prisma.SelectSubset<T, DocumentVersionCreateArgs<ExtArgs>>): Prisma.Prisma__DocumentVersionClient<runtime.Types.Result.GetResult<Prisma.$DocumentVersionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DocumentVersionCreateManyArgs>(args?: Prisma.SelectSubset<T, DocumentVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DocumentVersionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DocumentVersionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocumentVersionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DocumentVersionDeleteArgs>(args: Prisma.SelectSubset<T, DocumentVersionDeleteArgs<ExtArgs>>): Prisma.Prisma__DocumentVersionClient<runtime.Types.Result.GetResult<Prisma.$DocumentVersionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DocumentVersionUpdateArgs>(args: Prisma.SelectSubset<T, DocumentVersionUpdateArgs<ExtArgs>>): Prisma.Prisma__DocumentVersionClient<runtime.Types.Result.GetResult<Prisma.$DocumentVersionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DocumentVersionDeleteManyArgs>(args?: Prisma.SelectSubset<T, DocumentVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DocumentVersionUpdateManyArgs>(args: Prisma.SelectSubset<T, DocumentVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DocumentVersionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DocumentVersionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DocumentVersionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DocumentVersionUpsertArgs>(args: Prisma.SelectSubset<T, DocumentVersionUpsertArgs<ExtArgs>>): Prisma.Prisma__DocumentVersionClient<runtime.Types.Result.GetResult<Prisma.$DocumentVersionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DocumentVersionCountArgs>(args?: Prisma.Subset<T, DocumentVersionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DocumentVersionCountAggregateOutputType> : number>;
    aggregate<T extends DocumentVersionAggregateArgs>(args: Prisma.Subset<T, DocumentVersionAggregateArgs>): Prisma.PrismaPromise<GetDocumentVersionAggregateType<T>>;
    groupBy<T extends DocumentVersionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DocumentVersionGroupByArgs['orderBy'];
    } : {
        orderBy?: DocumentVersionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DocumentVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DocumentVersionFieldRefs;
}
export interface Prisma__DocumentVersionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    node<T extends Prisma.NodeDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.NodeDefaultArgs<ExtArgs>>): Prisma.Prisma__NodeClient<runtime.Types.Result.GetResult<Prisma.$NodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    mediaFile<T extends Prisma.DocumentVersion$mediaFileArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.DocumentVersion$mediaFileArgs<ExtArgs>>): Prisma.Prisma__MediaFileClient<runtime.Types.Result.GetResult<Prisma.$MediaFilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DocumentVersionFieldRefs {
    readonly id: Prisma.FieldRef<"DocumentVersion", 'String'>;
    readonly version: Prisma.FieldRef<"DocumentVersion", 'Int'>;
    readonly nodeId: Prisma.FieldRef<"DocumentVersion", 'String'>;
    readonly conversionStatus: Prisma.FieldRef<"DocumentVersion", 'ConversionStatus'>;
    readonly createdAt: Prisma.FieldRef<"DocumentVersion", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"DocumentVersion", 'DateTime'>;
}
export type DocumentVersionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocumentVersionOmit<ExtArgs> | null;
    include?: Prisma.DocumentVersionInclude<ExtArgs> | null;
    where: Prisma.DocumentVersionWhereUniqueInput;
};
export type DocumentVersionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocumentVersionOmit<ExtArgs> | null;
    include?: Prisma.DocumentVersionInclude<ExtArgs> | null;
    where: Prisma.DocumentVersionWhereUniqueInput;
};
export type DocumentVersionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DocumentVersionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DocumentVersionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type DocumentVersionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocumentVersionOmit<ExtArgs> | null;
    include?: Prisma.DocumentVersionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocumentVersionCreateInput, Prisma.DocumentVersionUncheckedCreateInput>;
};
export type DocumentVersionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DocumentVersionCreateManyInput | Prisma.DocumentVersionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DocumentVersionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentVersionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DocumentVersionOmit<ExtArgs> | null;
    data: Prisma.DocumentVersionCreateManyInput | Prisma.DocumentVersionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.DocumentVersionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type DocumentVersionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocumentVersionOmit<ExtArgs> | null;
    include?: Prisma.DocumentVersionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocumentVersionUpdateInput, Prisma.DocumentVersionUncheckedUpdateInput>;
    where: Prisma.DocumentVersionWhereUniqueInput;
};
export type DocumentVersionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DocumentVersionUpdateManyMutationInput, Prisma.DocumentVersionUncheckedUpdateManyInput>;
    where?: Prisma.DocumentVersionWhereInput;
    limit?: number;
};
export type DocumentVersionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentVersionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DocumentVersionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DocumentVersionUpdateManyMutationInput, Prisma.DocumentVersionUncheckedUpdateManyInput>;
    where?: Prisma.DocumentVersionWhereInput;
    limit?: number;
    include?: Prisma.DocumentVersionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type DocumentVersionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocumentVersionOmit<ExtArgs> | null;
    include?: Prisma.DocumentVersionInclude<ExtArgs> | null;
    where: Prisma.DocumentVersionWhereUniqueInput;
    create: Prisma.XOR<Prisma.DocumentVersionCreateInput, Prisma.DocumentVersionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DocumentVersionUpdateInput, Prisma.DocumentVersionUncheckedUpdateInput>;
};
export type DocumentVersionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocumentVersionOmit<ExtArgs> | null;
    include?: Prisma.DocumentVersionInclude<ExtArgs> | null;
    where: Prisma.DocumentVersionWhereUniqueInput;
};
export type DocumentVersionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DocumentVersionWhereInput;
    limit?: number;
};
export type DocumentVersion$mediaFileArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaFileSelect<ExtArgs> | null;
    omit?: Prisma.MediaFileOmit<ExtArgs> | null;
    include?: Prisma.MediaFileInclude<ExtArgs> | null;
    where?: Prisma.MediaFileWhereInput;
};
export type DocumentVersionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocumentVersionOmit<ExtArgs> | null;
    include?: Prisma.DocumentVersionInclude<ExtArgs> | null;
};
export {};
