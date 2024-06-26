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
        const deletedFromDatabase = await this.messagesService.deleteMessagesOlderThan(retentionTime);
        if (deletedFromDatabase > 0) {
            this.logger.log(`Deleted ${deletedFromDatabase} messages from database`);
        }
        const deletedFromStorage = await this.messagesStorageService.cleanMessagesOlderThan(retentionTime);
        if (deletedFromStorage > 0) {
            this.logger.log(`Deleted ${deletedFromStorage} messages from storage`);
        }
    }
}