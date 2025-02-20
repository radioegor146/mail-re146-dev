import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Message} from "../common/database/entities/message.entity";
import {LessThan, Repository} from "typeorm";

@Injectable()
export class MessagesService {
    constructor(@InjectRepository(Message) private messageRepository: Repository<Message>) {
    }

    async getMessagesByMailboxId(mailboxId: string): Promise<Message[]> {
        return this.messageRepository.findBy({
            mailboxId
        });
    }

    async getMessagesOlderThan(time: Date, limit: number): Promise<Message[]> {
        return await this.messageRepository.find({
            where: {
                receivedAt: LessThan(time)
            },
            take: limit
        });
    }

    async deleteMessage(message: Message): Promise<void> {
        await this.messageRepository.delete(message);
    }
}