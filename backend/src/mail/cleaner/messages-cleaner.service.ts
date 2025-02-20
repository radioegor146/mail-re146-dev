import {Injectable, Logger, OnModuleInit} from "@nestjs/common";
import {MessagesService} from "../messages.service";
import {ConfigService} from "@nestjs/config";
import {Cron, CronExpression} from "@nestjs/schedule";
import {MessagesStorageService} from "../storage/messages-storage.service";

@Injectable()
export class MessagesCleanerService implements OnModuleInit {
    private readonly logger = new Logger(MessagesCleanerService.name);
    private retentionPeriod: number;

    constructor(private messagesService: MessagesService, private messagesStorageService: MessagesStorageService,
                private configService: ConfigService) {
    }

    onModuleInit() {
        this.retentionPeriod = parseInt(this.configService.getOrThrow("RETENTION_PERIOD"));
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async cleanMessages(): Promise<void> {
        const retentionTime = new Date(Date.now() - this.retentionPeriod);
        this.logger.log(`Deleting messages older than ${retentionTime.toISOString()}`);
        while (true) {
            const messages = await this.messagesService.getMessagesOlderThan(retentionTime, 10);
            if (messages.length === 0) {
                break;
            }

            for (const message of messages) {
                try {
                    await this.messagesStorageService.deleteMessage(message.mailboxId, message.id);
                } catch (e) {
                    this.logger.error(`Failed to delete message ${message.id} from storage: ${e}`);
                }
                await this.messagesService.deleteMessage(message);
            }
        }
    }
}