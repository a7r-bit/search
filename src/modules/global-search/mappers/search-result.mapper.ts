import { ElasticTypes } from '../../../common/constants';
import { DirectorySearchItemDto, FileSearchItemDto } from '../dto/search-result-item.dto';
import { SearchHighlightViewDto } from '../dto/search-highlight.dto';

type RawElasticHighlight = {
    name?: string[];
    description?: string[];
    fileName?: string[];
    content?: string[];
};

function clearLines(value: string[]): string[] {
    return value.map((item) => item.replace(/\n/g, ' '));
}

function cleanHighlight(highlight: RawElasticHighlight | undefined): RawElasticHighlight | undefined {
    if (!highlight) {
        return undefined;
    }

    const cleaned: RawElasticHighlight = {};
    for (const key of Object.keys(highlight) as (keyof RawElasticHighlight)[]) {
        const fragments = highlight[key];
        if (fragments?.length) {
            cleaned[key] = clearLines(fragments);
        }
    }

    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
}

function buildDirectoryHighlight(
    highlight: RawElasticHighlight | undefined,
    name: string,
    description?: string | null,
): SearchHighlightViewDto {
    const title = highlight?.name?.[0] ?? name;
    const snippet = highlight?.description?.[0] ?? (description?.trim() || null);

    return {
        title,
        snippet: snippet || null,
    };
}

function buildFileHighlight(
    highlight: RawElasticHighlight | undefined,
    fileName: string,
): SearchHighlightViewDto {
    return {
        title: highlight?.fileName?.[0] ?? fileName,
        snippet: highlight?.content?.[0] ?? null,
    };
}

function formatFilePath(path: string): string {
    // return '/' + path.replace(/\\/g, '/').replace(/^\/+/, '');
    return path
}

export function mapElasticHitToSearchItem(hit: {
    _index: string;
    _id: string;
    _score?: number | null;
    _source?: Record<string, unknown>;
    highlight?: RawElasticHighlight;
}): DirectorySearchItemDto | FileSearchItemDto {
    const index = hit._index as ElasticTypes;
    const score = hit._score ?? 0;
    const highlight = cleanHighlight(hit.highlight);
    const src = hit._source ?? {};

    switch (index) {
        case ElasticTypes.Node:
            return {
                kind: 'directory',
                id: hit._id,
                parentId: (src.parentId as string | null | undefined) ?? null,
                name: (src.name as string) ?? '',
                description: (src.description as string | undefined) ?? null,
                score,
                path: [],
                highlight: buildDirectoryHighlight(
                    highlight,
                    (src.name as string) ?? '',
                    (src.description as string | undefined) ?? null,
                ),
            };

        case ElasticTypes.DocumentVersion: {
            const fileName = (src.fileName as string) ?? '';
            const filePath = (src.path as string) ?? '';

            return {
                kind: 'file',
                id: hit._id,
                nodeId: (src.nodeId as string) ?? '',
                parentId: null,
                fileName,
                version: (src.version as number) ?? 0,
                fileUrl: filePath ? formatFilePath(filePath) : '',
                createdAt: new Date((src.createdAt as string) ?? Date.now()),
                score,
                path: [],
                highlight: buildFileHighlight(highlight, fileName),
            };
        }

        default:
            throw new Error(`Unsupported index in mapElasticHitToSearchItem: ${index}`);
    }
}
