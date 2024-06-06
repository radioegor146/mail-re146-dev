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

    async deleteMessagesOlderThan(time: Date): Promise<number> {
        return (await this.messageRepository.delete({
            receivedAt: LessThan(time)
        })).affected!;
    }
}