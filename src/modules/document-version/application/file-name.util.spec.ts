import { normalizeUploadedFileName } from './file-name.util';

describe('normalizeUploadedFileName', () => {
    it('returns the name unchanged when there is no mojibake', () => {
        expect(normalizeUploadedFileName('report.pdf')).toBe('report.pdf');
    });

    it('decodes a utf8 name mangled as latin1', () => {
        // «Заключение» в utf8, прочитанное как latin1 (так приходят имена из браузера)
        const mangled = Buffer.from('Заключение', 'utf8').toString('latin1');

        expect(mangled).not.toContain('З');
        expect(normalizeUploadedFileName(mangled)).toBe('Заключение');
    });

    it('returns an empty string as is', () => {
        expect(normalizeUploadedFileName('')).toBe('');
    });
});
