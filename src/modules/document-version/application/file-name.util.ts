export function normalizeUploadedFileName(fileName: string): string {
    const decoded = Buffer.from(fileName, 'latin1').toString('utf8');
    const hasMojibake = /[ÐÑ]/.test(fileName);
    return hasMojibake ? decoded : fileName;
}
