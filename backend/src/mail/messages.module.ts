import {Module} from "@nestjs/common";
import {MessagesController} from "./messages.controller";
import {MessagesCleanerService} from "./cleaner/messages-cleaner.service";
import {MessagesStorageService} from "./storage/messages-storage.service";
import {MessagesService} from "./messages.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Message} from "../common/database/entities/message.entity";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [TypeOrmModule.forFeature([Message]),
        ConfigModule],
    controllers: [MessagesController],
    providers: [MessagesCleanerService, MessagesStorageService, MessagesService]
})
export class MessagesModule {
}