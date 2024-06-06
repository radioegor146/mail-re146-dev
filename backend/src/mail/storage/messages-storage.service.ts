import {Injectable, OnModuleInit} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {promises as fsPromises} from "fs";
import {join} from "path";

@Injectable()
export class MessagesStorageService implements OnModuleInit {
    private storagePath: string;

    constructor(private readonly configService: ConfigService) {
    }

    onModuleInit() {
        this.storagePath = this.configService.getOrThrow("STORAGE_PATH");
    }

    async cleanMessagesOlderThan(time: Date): Promise<number> {
        const files = await fsPromises.readdir(this.storagePath, {
            recursive: true
        });

        let deleted = 0;

        for (const file of files) {
            if ((await fsPromises.stat(join(this.storagePath, file))).ctime.getTime() < time.getTime()) {
                await fsPromises.unlink(join(this.storagePath, file));
                deleted++;
            }
        }

        return deleted;
    }
}