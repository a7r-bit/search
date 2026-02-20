export declare const NodeType: {
    readonly DIRECTORY: "DIRECTORY";
    readonly DOCUMENT: "DOCUMENT";
};
export type NodeType = (typeof NodeType)[keyof typeof NodeType];
export declare const ConversionStatus: {
    readonly PENDING: "PENDING";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly DONE: "DONE";
    readonly FAILED: "FAILED";
};
export type ConversionStatus = (typeof ConversionStatus)[keyof typeof ConversionStatus];
