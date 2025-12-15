export class DocumentIndex {
    constructor(title: string, description: string | null, directoryId: string) {
        this.title = title
        this.description = description
        this.directoryId = directoryId
    }

    title: string;
    description: string | null;
    directoryId: string;

}