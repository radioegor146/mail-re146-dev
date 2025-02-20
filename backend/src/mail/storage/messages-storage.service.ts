import {Injectable, Logger, OnModuleInit} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {
    CreateBucketCommand, DeleteObjectCommand,
    DeletePublicAccessBlockCommand,
    PutBucketPolicyCommand,
    S3Client
} from "@aws-sdk/client-s3";

@Injectable()
export class MessagesStorageService implements OnModuleInit {
    private readonly logger = new Logger(MessagesStorageService.name);

    private s3Client: S3Client;
    private bucket: string;

    constructor(private readonly configService: ConfigService) {
    }

    async onModuleInit(): Promise<void> {
        this.s3Client = new S3Client({
            endpoint: this.configService.getOrThrow("S3_ENDPOINT"),
            credentials: {
                accessKeyId: this.configService.getOrThrow("S3_ACCESS_KEY"),
                secretAccessKey: this.configService.getOrThrow("S3_SECRET_KEY")
            },
            region: this.configService.getOrThrow("S3_REGION"),
            forcePathStyle: true
        });
        this.bucket = this.configService.getOrThrow("S3_BUCKET");

        try {
            await this.s3Client.send(new CreateBucketCommand({
                Bucket: this.bucket
            }));
            this.logger.log(`Bucket '${this.bucket}' created`);
        } catch (e) {
            this.logger.warn(`Failed to create bucket '${this.bucket}': ${e}`);
        }
        try {
            await this.s3Client.send(new PutBucketPolicyCommand({
                Bucket: this.bucket,
                Policy: JSON.stringify({
                    Version: "2012-10-17",
                    Statement: [
                        {
                            Effect: "Allow",
                            Action: "s3:GetObject",
                            Resource: `arn:aws:s3:::${this.bucket}/*`,
                        },
                    ]
                })
            }));
            this.logger.log(`Bucket '${this.bucket}' policy updated`);
        } catch (e) {
            this.logger.warn(`Failed to update policy for bucket '${this.bucket}': ${e}`);
        }
    }

    async deleteMessage(mailboxId: string, messageId: string): Promise<void> {
        await this.s3Client.send(new DeleteObjectCommand({
            Key: `${mailboxId}/${messageId}`,
            Bucket: this.bucket
        }));
    }
}