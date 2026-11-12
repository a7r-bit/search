import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import fs from 'fs';
import https from 'https';
import path from 'path';

export type Prefix = 'original' | 'converted';

@Injectable()
export class S3Service {
    private readonly accessKeyId: string;
    private readonly secretAccessKey: string;
    private readonly bucket: string;
    private readonly region: string;
    private readonly endpoint?: string;
    private readonly forcePathStyle: boolean;
    private readonly tlsRejectUnauthorized: boolean;
    private readonly caBundlePath?: string;
    private readonly publicUrl: string;
    public readonly s3Client: S3Client;

    constructor(private config: ConfigService) {
        this.accessKeyId = this.config.getOrThrow<string>('AWS_ACCESS_KEY_ID');
        this.secretAccessKey = this.config.getOrThrow<string>('AWS_SECRET_ACCESS_KEY');
        this.bucket = this.config.getOrThrow<string>('AWS_BUCKET_NAME');
        this.region = this.config.getOrThrow<string>('AWS_S3_REGION');
        this.endpoint = this.config.get<string>('AWS_S3_ENDPOINT') || undefined;
        this.forcePathStyle = (this.config.get<string>('AWS_S3_FORCE_PATH_STYLE') ?? 'false').toLowerCase() === 'true';
        this.tlsRejectUnauthorized = (this.config.get<string>('AWS_S3_TLS_REJECT_UNAUTHORIZED') ?? 'true').toLowerCase() !== 'false';
        this.caBundlePath = this.config.get<string>('AWS_S3_CA_BUNDLE_PATH') || undefined;
        this.publicUrl = (this.config.get<string>('APP_PUBLIC_URL') ?? '').replace(/\/+$/, '');

        const httpsAgent = new https.Agent({
            keepAlive: true,
            rejectUnauthorized: this.tlsRejectUnauthorized,
            ...(this.caBundlePath ? { ca: fs.readFileSync(this.caBundlePath) } : {}),
        });

        this.s3Client = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            },
            ...(this.endpoint ? { endpoint: this.endpoint } : {}),
            ...(this.endpoint ? { forcePathStyle: this.forcePathStyle } : {}),
            requestHandler: new NodeHttpHandler({ httpsAgent }),
        });
    }

    async uploadFile(file: Express.Multer.File, prefix: Prefix) {
        const uuid = crypto.randomUUID();
        const extension = path.extname(file.originalname ?? '').toLowerCase();
        const key = `${prefix}/${uuid}${extension}`;

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'authenticated-read',
            }),
        );

        return { key };
    }

    async uploadBufferAsPdf(buffer: Buffer, prefix: Prefix, extension = '.pdf', contentType = 'application/pdf') {
        const uuid = crypto.randomUUID();
        const key = `${prefix}/${uuid}${extension}`;

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: buffer,
                ContentType: contentType,
                ACL: 'authenticated-read',
            }),
        );

        return { key };
    }

    async getFileUrl(key: string, _expiresIn = 3600) {
        if (!(await this.checkFileExists(key))) {
            throw new NotFoundException('File not found');
        }

        return { url: `${this.publicUrl}/api/s3/file?key=${encodeURIComponent(key)}` };
    }

    async getFileForDownload(key: string): Promise<{ buffer: Buffer; contentType: string }> {
        if (!(await this.checkFileExists(key))) {
            throw new NotFoundException('File not found');
        }

        const [head, response] = await Promise.all([
            this.s3Client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key })),
            this.s3Client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key })),
        ]);

        return {
            buffer: Buffer.from(await response.Body?.transformToByteArray()),
            contentType: head.ContentType ?? 'application/octet-stream',
        };
    }

    async getFileBuffer(key: string): Promise<Buffer> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        if (!(await this.checkFileExists(key))) {
            throw new NotFoundException('File not found');
        }

        const response = await this.s3Client.send(command);
        return Buffer.from(await response.Body?.transformToByteArray());
    }

    async deleteFile(key: string) {
        await this.s3Client.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }),
        );
        return { message: 'File deleted successfully' };
    }

    async checkFileExists(key: string): Promise<boolean> {
        try {
            await this.s3Client.send(
                new HeadObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                }),
            );
            return true;
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'NotFound') {
                return false;
            }
            throw error;
        }
    }
}
