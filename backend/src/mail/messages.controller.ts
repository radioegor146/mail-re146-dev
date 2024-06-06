import {Controller, Get, Injectable, Param} from "@nestjs/common";
import {MessagesService} from "./messages.service";
import {ApiOkResponse, ApiOperation, ApiParam, ApiProperty, ApiTags} from "@nestjs/swagger";

class MessageDTO {
    @ApiProperty({format: "uuid"})
    id: string;

    @ApiProperty({format: "email"})
    from: string;

    @ApiProperty()
    subject: string;

    @ApiProperty({format: "date-time"})
    receivedAt: string;
}

@ApiTags('messages')
@Controller()
export class MessagesController {
    constructor(private messagesService: MessagesService) {
    }

    @Get("messages/:mailboxId")
    @ApiOperation({
        summary: "Get all messages by mailbox ID"
    })
    @ApiOkResponse({
        description: "Successful response",
        type: [MessageDTO],
    })
    @ApiParam({
        name: "mailboxId",
        description: "Mailbox ID (md5(account@domain))",
        example: "6121f87980450cacb7e49b12d3707d7d"
    })
    async getMessagesByMailboxId(@Param("mailboxId") mailboxId: string): Promise<MessageDTO[]> {
        const messages = await this.messagesService.getMessagesByMailboxId(mailboxId);
        return messages.map(message => ({
            id: message.id,
            from: message.from,
            subject: message.subject,
            receivedAt: message.receivedAt.toISOString()
        }));
    }
}