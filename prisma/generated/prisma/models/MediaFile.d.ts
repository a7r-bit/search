import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type MediaFileModel = runtime.Types.Result.DefaultSelection<Prisma.$MediaFilePayload>;
export type AggregateMediaFile = {
    _count: MediaFileCountAggregateOutputType | null;
    _min: MediaFileMinAggregateOutputType | null;
    _max: MediaFileMaxAggregateOutputType | null;
};
export type MediaFileMinAggregateOutputType = {
    id: string | null;
    filePath: string | null;
    fileName: string | null;
    extention: string | null;
    documentVersionId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type MediaFileMaxAggregateOutputType = {
    id: string | null;
    filePath: string | null;
    fileName: string | null;
    extention: string | null;
    documentVersionId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type MediaFileCountAggregateOutputType = {
    id: number;
    filePath: number;
    fileName: number;
    extention: number;
    documentVersionId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type MediaFileMinAggregateInputType = {
    id?: true;
    filePath?: true;
    fileName?: true;
    extention?: true;
    documentVersionId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type MediaFileMaxAggregateInputType = {
    id?: true;
    filePath?: true;
    fileName?: true;
    extention?: true;
    documentVersionId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type MediaFileCountAggregateInputType = {
    id?: true;
    filePath?: true;
    fileName?: true;
    extention?: true;
    documentVersionId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type MediaFileAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MediaFileWhereInput;
    orderBy?: Prisma.MediaFileOrderByWithRelationInput | Prisma.MediaFileOrderByWithRelationInput[];
    cursor?: Prisma.MediaFileWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MediaFileCountAggregateInputType;
    _min?: MediaFileMinAggregateInputType;
    _max?: MediaFileMaxAggregateInputType;
};
export type GetMediaFileAggregateType<T extends MediaFileAggregateArgs> = {
    [P in keyof T & keyof AggregateMediaFile]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMediaFile[P]> : Prisma.GetScalarType<T[P], AggregateMediaFile[P]>;
};
export type MediaFileGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MediaFileWhereInput;
    orderBy?: Prisma.MediaFileOrderByWithAggregationInput | Prisma.MediaFileOrderByWithAggregationInput[];
    by: Prisma.MediaFileScalarFieldEnum[] | Prisma.MediaFileScalarFieldEnum;
    having?: Prisma.MediaFileScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MediaFileCountAggregateInputType | true;
    _min?: MediaFileMinAggregateInputType;
    _max?: MediaFileMaxAggregateInputType;
};
export type MediaFileGroupByOutputType = {
    id: string;
    filePath: string;
    fileName: string;
    extention: string;
    documentVersionId: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: MediaFileCountAggregateOutputType | null;
    _min: MediaFileMinAggregateOutputType | null;
    _max: MediaFileMaxAggregateOutputType | null;
};
type GetMediaFileGroupByPayload<T extends MediaFileGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MediaFileGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MediaFileGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MediaFileGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MediaFileGroupByOutputType[P]>;
}>>;
export type MediaFileWhereInput = {
    AND?: Prisma.MediaFileWhereInput | Prisma.MediaFileWhereInput[];
    OR?: Prisma.MediaFileWhereInput[];
    NOT?: Prisma.MediaFileWhereInput | Prisma.MediaFileWhereInput[];
    id?: Prisma.UuidFilter<"MediaFile"> | string;
    filePath?: Prisma.StringFilter<"MediaFile"> | string;
    fileName?: Prisma.StringFilter<"MediaFile"> | string;
    extention?: Prisma.StringFilter<"MediaFile"> | string;
    documentVersionId?: Prisma.UuidNullableFilter<"MediaFile"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"MediaFile"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"MediaFile"> | Date | string;
    documentVersion?: Prisma.XOR<Prisma.DocumentVersionNullableScalarRelationFilter, Prisma.DocumentVersionWhereInput> | null;
};
export type MediaFileOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    filePath?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    extention?: Prisma.SortOrder;
    documentVersionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    documentVersion?: Prisma.DocumentVersionOrderByWithRelationInput;
};
export type MediaFileWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    documentVersionId?: string;
    AND?: Prisma.MediaFileWhereInput | Prisma.MediaFileWhereInput[];
    OR?: Prisma.MediaFileWhereInput[];
    NOT?: Prisma.MediaFileWhereInput | Prisma.MediaFileWhereInput[];
    filePath?: Prisma.StringFilter<"MediaFile"> | string;
    fileName?: Prisma.StringFilter<"MediaFile"> | string;
    extention?: Prisma.StringFilter<"MediaFile"> | string;
    createdAt?: Prisma.DateTimeFilter<"MediaFile"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"MediaFile"> | Date | string;
    documentVersion?: Prisma.XOR<Prisma.DocumentVersionNullableScalarRelationFilter, Prisma.DocumentVersionWhereInput> | null;
}, "id" | "documentVersionId">;
export type MediaFileOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    filePath?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    extention?: Prisma.SortOrder;
    documentVersionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.MediaFileCountOrderByAggregateInput;
    _max?: Prisma.MediaFileMaxOrderByAggregateInput;
    _min?: Prisma.MediaFileMinOrderByAggregateInput;
};
export type MediaFileScalarWhereWithAggregatesInput = {
    AND?: Prisma.MediaFileScalarWhereWithAggregatesInput | Prisma.MediaFileScalarWhereWithAggregatesInput[];
    OR?: Prisma.MediaFileScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MediaFileScalarWhereWithAggregatesInput | Prisma.MediaFileScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"MediaFile"> | string;
    filePath?: Prisma.StringWithAggregatesFilter<"MediaFile"> | string;
    fileName?: Prisma.StringWithAggregatesFilter<"MediaFile"> | string;
    extention?: Prisma.StringWithAggregatesFilter<"MediaFile"> | string;
    documentVersionId?: Prisma.UuidNullableWithAggregatesFilter<"MediaFile"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"MediaFile"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"MediaFile"> | Date | string;
};
export type MediaFileCreateInput = {
    id?: string;
    filePath: string;
    fileName: string;
    extention: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    documentVersion?: Prisma.DocumentVersionCreateNestedOneWithoutMediaFileInput;
};
export type MediaFileUncheckedCreateInput = {
    id?: string;
    filePath: string;
    fileName: string;
    extention: string;
    documentVersionId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MediaFileUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    filePath?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    extention?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    documentVersion?: Prisma.DocumentVersionUpdateOneWithoutMediaFileNestedInput;
};
export type MediaFileUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    filePath?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    extention?: Prisma.StringFieldUpdateOperationsInput | string;
    documentVersionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MediaFileCreateManyInput = {
    id?: string;
    filePath: string;
    fileName: string;
    extention: string;
    documentVersionId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MediaFileUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    filePath?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    extention?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MediaFileUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    filePath?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    extention?: Prisma.StringFieldUpdateOperationsInput | string;
    documentVersionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MediaFileNullableScalarRelationFilter = {
    is?: Prisma.MediaFileWhereInput | null;
    isNot?: Prisma.MediaFileWhereInput | null;
};
export type MediaFileCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    filePath?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    extention?: Prisma.SortOrder;
    documentVersionId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MediaFileMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    filePath?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    extention?: Prisma.SortOrder;
    documentVersionId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MediaFileMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    filePath?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    extention?: Prisma.SortOrder;
    documentVersionId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MediaFileCreateNestedOneWithoutDocumentVersionInput = {
    create?: Prisma.XOR<Prisma.MediaFileCreateWithoutDocumentVersionInput, Prisma.MediaFileUncheckedCreateWithoutDocumentVersionInput>;
    connectOrCreate?: Prisma.MediaFileCreateOrConnectWithoutDocumentVersionInput;
    connect?: Prisma.MediaFileWhereUniqueInput;
};
export type MediaFileUncheckedCreateNestedOneWithoutDocumentVersionInput = {
    create?: Prisma.XOR<Prisma.MediaFileCreateWithoutDocumentVersionInput, Prisma.MediaFileUncheckedCreateWithoutDocumentVersionInput>;
    connectOrCreate?: Prisma.MediaFileCreateOrConnectWithoutDocumentVersionInput;
    connect?: Prisma.MediaFileWhereUniqueInput;
};
export type MediaFileUpdateOneWithoutDocumentVersionNestedInput = {
    create?: Prisma.XOR<Prisma.MediaFileCreateWithoutDocumentVersionInput, Prisma.MediaFileUncheckedCreateWithoutDocumentVersionInput>;
    connectOrCreate?: Prisma.MediaFileCreateOrConnectWithoutDocumentVersionInput;
    upsert?: Prisma.MediaFileUpsertWithoutDocumentVersionInput;
    disconnect?: Prisma.MediaFileWhereInput | boolean;
    delete?: Prisma.MediaFileWhereInput | boolean;
    connect?: Prisma.MediaFileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MediaFileUpdateToOneWithWhereWithoutDocumentVersionInput, Prisma.MediaFileUpdateWithoutDocumentVersionInput>, Prisma.MediaFileUncheckedUpdateWithoutDocumentVersionInput>;
};
export type MediaFileUncheckedUpdateOneWithoutDocumentVersionNestedInput = {
    create?: Prisma.XOR<Prisma.MediaFileCreateWithoutDocumentVersionInput, Prisma.MediaFileUncheckedCreateWithoutDocumentVersionInput>;
    connectOrCreate?: Prisma.MediaFileCreateOrConnectWithoutDocumentVersionInput;
    upsert?: Prisma.MediaFileUpsertWithoutDocumentVersionInput;
    disconnect?: Prisma.MediaFileWhereInput | boolean;
    delete?: Prisma.MediaFileWhereInput | boolean;
    connect?: Prisma.MediaFileWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MediaFileUpdateToOneWithWhereWithoutDocumentVersionInput, Prisma.MediaFileUpdateWithoutDocumentVersionInput>, Prisma.MediaFileUncheckedUpdateWithoutDocumentVersionInput>;
};
export type MediaFileCreateWithoutDocumentVersionInput = {
    id?: string;
    filePath: string;
    fileName: string;
    extention: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MediaFileUncheckedCreateWithoutDocumentVersionInput = {
    id?: string;
    filePath: string;
    fileName: string;
    extention: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MediaFileCreateOrConnectWithoutDocumentVersionInput = {
    where: Prisma.MediaFileWhereUniqueInput;
    create: Prisma.XOR<Prisma.MediaFileCreateWithoutDocumentVersionInput, Prisma.MediaFileUncheckedCreateWithoutDocumentVersionInput>;
};
export type MediaFileUpsertWithoutDocumentVersionInput = {
    update: Prisma.XOR<Prisma.MediaFileUpdateWithoutDocumentVersionInput, Prisma.MediaFileUncheckedUpdateWithoutDocumentVersionInput>;
    create: Prisma.XOR<Prisma.MediaFileCreateWithoutDocumentVersionInput, Prisma.MediaFileUncheckedCreateWithoutDocumentVersionInput>;
    where?: Prisma.MediaFileWhereInput;
};
export type MediaFileUpdateToOneWithWhereWithoutDocumentVersionInput = {
    where?: Prisma.MediaFileWhereInput;
    data: Prisma.XOR<Prisma.MediaFileUpdateWithoutDocumentVersionInput, Prisma.MediaFileUncheckedUpdateWithoutDocumentVersionInput>;
};
export type MediaFileUpdateWithoutDocumentVersionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    filePath?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    extention?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MediaFileUncheckedUpdateWithoutDocumentVersionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    filePath?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    extention?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MediaFileSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    filePath?: boolean;
    fileName?: boolean;
    extention?: boolean;
    documentVersionId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    documentVersion?: boolean | Prisma.MediaFile$documentVersionArgs<ExtArgs>;
}, ExtArgs["result"]["mediaFile"]>;
export type MediaFileSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    filePath?: boolean;
    fileName?: boolean;
    extention?: boolean;
    documentVersionId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    documentVersion?: boolean | Prisma.MediaFile$documentVersionArgs<ExtArgs>;
}, ExtArgs["result"]["mediaFile"]>;
export type MediaFileSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    filePath?: boolean;
    fileName?: boolean;
    extention?: boolean;
    documentVersionId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    documentVersion?: boolean | Prisma.MediaFile$documentVersionArgs<ExtArgs>;
}, ExtArgs["result"]["mediaFile"]>;
export type MediaFileSelectScalar = {
    id?: boolean;
    filePath?: boolean;
    fileName?: boolean;
    extention?: boolean;
    documentVersionId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type MediaFileOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "filePath" | "fileName" | "extention" | "documentVersionId" | "createdAt" | "updatedAt", ExtArgs["result"]["mediaFile"]>;
export type MediaFileInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    documentVersion?: boolean | Prisma.MediaFile$documentVersionArgs<ExtArgs>;
};
export type MediaFileIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    documentVersion?: boolean | Prisma.MediaFile$documentVersionArgs<ExtArgs>;
};
export type MediaFileIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    documentVersion?: boolean | Prisma.MediaFile$documentVersionArgs<ExtArgs>;
};
export type $MediaFilePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MediaFile";
    objects: {
        documentVersion: Prisma.$DocumentVersionPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        filePath: string;
        fileName: string;
        extention: string;
        documentVersionId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["mediaFile"]>;
    composites: {};
};
export type MediaFileGetPayload<S extends boolean | null | undefined | MediaFileDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MediaFilePayload, S>;
export type MediaFileCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MediaFileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MediaFileCountAggregateInputType | true;
};
export interface MediaFileDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MediaFile'];
        meta: {
            name: 'MediaFile';
        };
    };
    findUnique<T extends MediaFileFindUniqueArgs>(args: Prisma.SelectSubset<T, MediaFileFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MediaFileClient<runtime.Types.Result.GetResult<Prisma.$MediaFilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MediaFileFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MediaFileFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MediaFileClient<runtime.Types.Result.GetResult<Prisma.$MediaFilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MediaFileFindFirstArgs>(args?: Prisma.SelectSubset<T, MediaFileFindFirstArgs<ExtArgs>>): Prisma.Prisma__MediaFileClient<runtime.Types.Result.GetResult<Prisma.$MediaFilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MediaFileFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MediaFileFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MediaFileClient<runtime.Types.Result.GetResult<Prisma.$MediaFilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MediaFileFindManyArgs>(args?: Prisma.SelectSubset<T, MediaFileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MediaFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MediaFileCreateArgs>(args: Prisma.SelectSubset<T, MediaFileCreateArgs<ExtArgs>>): Prisma.Prisma__MediaFileClient<runtime.Types.Result.GetResult<Prisma.$MediaFilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MediaFileCreateManyArgs>(args?: Prisma.SelectSubset<T, MediaFileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MediaFileCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MediaFileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MediaFilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MediaFileDeleteArgs>(args: Prisma.SelectSubset<T, MediaFileDeleteArgs<ExtArgs>>): Prisma.Prisma__MediaFileClient<runtime.Types.Result.GetResult<Prisma.$MediaFilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MediaFileUpdateArgs>(args: Prisma.SelectSubset<T, MediaFileUpdateArgs<ExtArgs>>): Prisma.Prisma__MediaFileClient<runtime.Types.Result.GetResult<Prisma.$MediaFilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MediaFileDeleteManyArgs>(args?: Prisma.SelectSubset<T, MediaFileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MediaFileUpdateManyArgs>(args: Prisma.SelectSubset<T, MediaFileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MediaFileUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MediaFileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MediaFilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MediaFileUpsertArgs>(args: Prisma.SelectSubset<T, MediaFileUpsertArgs<ExtArgs>>): Prisma.Prisma__MediaFileClient<runtime.Types.Result.GetResult<Prisma.$MediaFilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MediaFileCountArgs>(args?: Prisma.Subset<T, MediaFileCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MediaFileCountAggregateOutputType> : number>;
    aggregate<T extends MediaFileAggregateArgs>(args: Prisma.Subset<T, MediaFileAggregateArgs>): Prisma.PrismaPromise<GetMediaFileAggregateType<T>>;
    groupBy<T extends MediaFileGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MediaFileGroupByArgs['orderBy'];
    } : {
        orderBy?: MediaFileGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MediaFileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMediaFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MediaFileFieldRefs;
}
export interface Prisma__MediaFileClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    documentVersion<T extends Prisma.MediaFile$documentVersionArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MediaFile$documentVersionArgs<ExtArgs>>): Prisma.Prisma__DocumentVersionClient<runtime.Types.Result.GetResult<Prisma.$DocumentVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MediaFileFieldRefs {
    readonly id: Prisma.FieldRef<"MediaFile", 'String'>;
    readonly filePath: Prisma.FieldRef<"MediaFile", 'String'>;
    readonly fileName: Prisma.FieldRef<"MediaFile", 'String'>;
    readonly extention: Prisma.FieldRef<"MediaFile", 'String'>;
    readonly documentVersionId: Prisma.FieldRef<"MediaFile", 'String'>;
    readonly createdAt: Prisma.FieldRef<"MediaFile", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"MediaFile", 'DateTime'>;
}
export type MediaFileFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaFileSelect<ExtArgs> | null;
    omit?: Prisma.MediaFileOmit<ExtArgs> | null;
    include?: Prisma.MediaFileInclude<ExtArgs> | null;
    where: Prisma.MediaFileWhereUniqueInput;
};
export type MediaFileFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaFileSelect<ExtArgs> | null;
    omit?: Prisma.MediaFileOmit<ExtArgs> | null;
    include?: Prisma.MediaFileInclude<ExtArgs> | null;
    where: Prisma.MediaFileWhereUniqueInput;
};
export type MediaFileFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaFileSelect<ExtArgs> | null;
    omit?: Prisma.MediaFileOmit<ExtArgs> | null;
    include?: Prisma.MediaFileInclude<ExtArgs> | null;
    where?: Prisma.MediaFileWhereInput;
    orderBy?: Prisma.MediaFileOrderByWithRelationInput | Prisma.MediaFileOrderByWithRelationInput[];
    cursor?: Prisma.MediaFileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MediaFileScalarFieldEnum | Prisma.MediaFileScalarFieldEnum[];
};
export type MediaFileFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaFileSelect<ExtArgs> | null;
    omit?: Prisma.MediaFileOmit<ExtArgs> | null;
    include?: Prisma.MediaFileInclude<ExtArgs> | null;
    where?: Prisma.MediaFileWhereInput;
    orderBy?: Prisma.MediaFileOrderByWithRelationInput | Prisma.MediaFileOrderByWithRelationInput[];
    cursor?: Prisma.MediaFileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MediaFileScalarFieldEnum | Prisma.MediaFileScalarFieldEnum[];
};
export type MediaFileFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaFileSelect<ExtArgs> | null;
    omit?: Prisma.MediaFileOmit<ExtArgs> | null;
    include?: Prisma.MediaFileInclude<ExtArgs> | null;
    where?: Prisma.MediaFileWhereInput;
    orderBy?: Prisma.MediaFileOrderByWithRelationInput | Prisma.MediaFileOrderByWithRelationInput[];
    cursor?: Prisma.MediaFileWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MediaFileScalarFieldEnum | Prisma.MediaFileScalarFieldEnum[];
};
export type MediaFileCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaFileSelect<ExtArgs> | null;
    omit?: Prisma.MediaFileOmit<ExtArgs> | null;
    include?: Prisma.MediaFileInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MediaFileCreateInput, Prisma.MediaFileUncheckedCreateInput>;
};
export type MediaFileCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MediaFileCreateManyInput | Prisma.MediaFileCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MediaFileCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaFileSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MediaFileOmit<ExtArgs> | null;
    data: Prisma.MediaFileCreateManyInput | Prisma.MediaFileCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.MediaFileIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type MediaFileUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaFileSelect<ExtArgs> | null;
    omit?: Prisma.MediaFileOmit<ExtArgs> | null;
    include?: Prisma.MediaFileInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MediaFileUpdateInput, Prisma.MediaFileUncheckedUpdateInput>;
    where: Prisma.MediaFileWhereUniqueInput;
};
export type MediaFileUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MediaFileUpdateManyMutationInput, Prisma.MediaFileUncheckedUpdateManyInput>;
    where?: Prisma.MediaFileWhereInput;
    limit?: number;
};
export type MediaFileUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaFileSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MediaFileOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MediaFileUpdateManyMutationInput, Prisma.MediaFileUncheckedUpdateManyInput>;
    where?: Prisma.MediaFileWhereInput;
    limit?: number;
    include?: Prisma.MediaFileIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type MediaFileUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaFileSelect<ExtArgs> | null;
    omit?: Prisma.MediaFileOmit<ExtArgs> | null;
    include?: Prisma.MediaFileInclude<ExtArgs> | null;
    where: Prisma.MediaFileWhereUniqueInput;
    create: Prisma.XOR<Prisma.MediaFileCreateInput, Prisma.MediaFileUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MediaFileUpdateInput, Prisma.MediaFileUncheckedUpdateInput>;
};
export type MediaFileDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaFileSelect<ExtArgs> | null;
    omit?: Prisma.MediaFileOmit<ExtArgs> | null;
    include?: Prisma.MediaFileInclude<ExtArgs> | null;
    where: Prisma.MediaFileWhereUniqueInput;
};
export type MediaFileDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MediaFileWhereInput;
    limit?: number;
};
export type MediaFile$documentVersionArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentVersionSelect<ExtArgs> | null;
    omit?: Prisma.DocumentVersionOmit<ExtArgs> | null;
    include?: Prisma.DocumentVersionInclude<ExtArgs> | null;
    where?: Prisma.DocumentVersionWhereInput;
};
export type MediaFileDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MediaFileSelect<ExtArgs> | null;
    omit?: Prisma.MediaFileOmit<ExtArgs> | null;
    include?: Prisma.MediaFileInclude<ExtArgs> | null;
};
export {};
