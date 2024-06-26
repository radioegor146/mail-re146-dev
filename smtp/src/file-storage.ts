import {promises as fsPromises} from "fs";
import path from "path";

export class FileStorage {
    constructor(private readonly storagePath: string) {
    }

    async addEmail(mailboxId: string, messageId: string, content: Buffer): Promise<void> {
        const mailboxPath = path.join(this.storagePath, mailboxId);
        const messagePath = path.join(mailboxPath, messageId);
        await fsPromises.mkdir(mailboxPath, {
            recursive: true
        });
        await fsPromises.writeFile(messagePath, content);
    }
}