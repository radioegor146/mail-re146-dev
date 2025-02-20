import { PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

export interface S3StorageConfig {
    endpoint: string;
    accessKey: string;
    secretKey: string;
    bucket: string;
    region: string;
}

export class S3Storage {
    private readonly s3Client: S3Client;

    constructor(private readonly config: S3StorageConfig) {
        this.s3Client = new S3Client({
            endpoint: config.endpoint,
            credentials: {
                accessKeyId: config.accessKey,
                secretAccessKey: config.secretKey,
            },
            region: config.region
        })
    }

    async addEmail(mailboxId: string, messageId: string, content: Buffer): Promise<void> {
        const key = `${mailboxId}/${messageId}`;
        await this.s3Client.send(new PutObjectCommand({
            Key: key,
            ContentType: "text/plain",
            Bucket: this.config.bucket,
            Body: content
        }));
    }
}